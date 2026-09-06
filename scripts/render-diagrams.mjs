import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { Resvg } from "@resvg/resvg-js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const diagramsDir = path.join(repoRoot, "diagrams");
const fontsDir = path.join(diagramsDir, "fonts");
const manifestPath = path.join(diagramsDir, "manifest.json");
const rendererPath = fileURLToPath(import.meta.url);
const checkOnly = process.argv.includes("--check");

const DESIGN_FULL = "engineering-doc-v3";
const DESIGN_PREVIEW = "readme-preview-v3";
const MAX_GRAPH_WIDTH = 980;
const OUTER_GRAPH_PADDING = 36;
const ROOT_GAP = 38;
const ROOT_ROW_GAP = 56;
const SECTION_GAP = 138;
const ROUTING_MARGIN = 72;
const MODULAR_COLUMN_GAP = 170;
const GROUP_PADDING_X = 28;
const GROUP_PADDING_BOTTOM = 28;
const HORIZONTAL_GROUP_PADDING_BOTTOM = 52;
const GROUP_HEADER_HEIGHT = 82;
const NESTED_HEADER_HEIGHT = 74;
const CHILD_GAP_VERTICAL = 60;
const CHILD_GAP_HORIZONTAL = 30;
const NODE_MIN_WIDTH = 276;
const NODE_MAX_WIDTH = 388;
const NODE_MIN_HEIGHT = 70;
const EDGE_LABEL_FONT_SIZE = 16;
const EDGE_LABEL_LINE_HEIGHT = 18;

const COLORS = {
  canvas: "#FFFFFF",
  canvasPreview: "#FFFFFF",
  ink: "#14283B",
  muted: "#5F6E7C",
  faint: "#6A7782",
  divider: "#E4E8EC",
  arrow: "#243F57",
  applicationFill: "#FFF9F0",
  applicationNodeFill: "#FFFEFC",
  applicationStroke: "#A86416",
  platformFill: "#F5FAFD",
  platformNodeFill: "#FFFFFF",
  platformStroke: "#3A7197",
  sharedFill: "#FAF8FF",
  sharedNodeFill: "#FFFFFF",
  sharedStroke: "#7255AA",
  conceptualFill: "#FBFCFD",
  conceptualNodeFill: "#FFFFFF",
  conceptualStroke: "#647786",
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const rendererSource = fs.readFileSync(rendererPath);
const regularTtf = path.join(fontsDir, "Inter-Regular.ttf");
const semiboldTtf = path.join(fontsDir, "Inter-SemiBold.ttf");
const regularWoff2 = fs.readFileSync(path.join(fontsDir, "Inter-Regular.woff2")).toString("base64");
const semiboldWoff2 = fs.readFileSync(path.join(fontsDir, "Inter-SemiBold.woff2")).toString("base64");
const fontFiles = [regularTtf, semiboldTtf];
const fontFingerprint = createHash("sha256")
  .update(fs.readFileSync(regularTtf))
  .update(fs.readFileSync(semiboldTtf))
  .update(regularWoff2)
  .update(semiboldWoff2)
  .digest("hex");

function fail(message) {
  throw new Error(message);
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function splitLongWord(word, maximumCharacters) {
  if (word.length <= maximumCharacters) return [word];
  const semantic = word
    .replace(/([a-z0-9])([A-Z])/g, "$1\u0000$2")
    .replace(/([:._/-])/g, "$1\u0000")
    .split("\u0000")
    .filter(Boolean);
  if (semantic.length === 1) return [word];
  const pieces = [];
  let current = "";
  for (const part of semantic) {
    if (current && current.length + part.length > maximumCharacters) {
      pieces.push(current);
      current = part;
    } else {
      current += part;
    }
  }
  if (current) pieces.push(current);
  return pieces;
}

function wrapText(value, maximumCharacters, maximumLines) {
  const text = cleanText(value);
  if (!text) return [];
  const words = text
    .split(" ")
    .flatMap((word) => splitLongWord(word, maximumCharacters));
  const lines = [];
  let current = "";
  let index = 0;
  while (index < words.length && lines.length < maximumLines) {
    const word = words[index];
    const candidate = current ? current + " " + word : word;
    if (!current || candidate.length <= maximumCharacters) {
      current = candidate;
      index += 1;
    } else {
      lines.push(current);
      current = "";
    }
  }
  if (current && lines.length < maximumLines) lines.push(current);
  if (index < words.length && lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.…]+$/, "") + "…";
  }
  return lines;
}

function estimatedWidth(value, fontSize, weight) {
  const factor = weight >= 600 ? 0.57 : 0.54;
  return cleanText(value).length * fontSize * factor;
}

function validateSpec(spec, entry) {
  if (!spec || typeof spec !== "object") fail(entry.spec + " must contain an object.");
  if (spec.schemaVersion !== 1) fail(entry.spec + " must use schemaVersion 1.");
  if (spec.id !== entry.id) fail(entry.spec + " id must match manifest id " + entry.id + ".");
  if (!Number.isInteger(spec.number) || spec.number < 1) fail(entry.spec + " number must be a positive integer.");
  if (!Array.isArray(spec.groups) || !Array.isArray(spec.nodes) || !Array.isArray(spec.edges)) {
    fail(entry.spec + " must contain groups, nodes, and edges arrays.");
  }
  const groupIds = new Set();
  for (const group of spec.groups) {
    if (!group.id || groupIds.has(group.id)) fail(entry.spec + " has a duplicate or empty group id.");
    groupIds.add(group.id);
    if (!["application", "conceptual", "platform", "shared"].includes(group.kind)) {
      fail(entry.spec + " group " + group.id + " has unsupported kind " + group.kind + ".");
    }
    if (!["vertical", "horizontal"].includes(group.layout)) {
      fail(entry.spec + " group " + group.id + " has unsupported layout " + group.layout + ".");
    }
  }
  const itemIds = new Set(groupIds);
  for (const node of spec.nodes) {
    if (!node.id || itemIds.has(node.id)) fail(entry.spec + " has a duplicate or empty node id.");
    itemIds.add(node.id);
    if (!groupIds.has(node.parent)) fail(entry.spec + " node " + node.id + " has unknown parent " + node.parent + ".");
    if (!["application", "conceptual", "platform", "shared"].includes(node.kind)) {
      fail(entry.spec + " node " + node.id + " has unsupported kind " + node.kind + ".");
    }
    if (!Array.isArray(node.sourceRefs)) fail(entry.spec + " node " + node.id + " needs sourceRefs.");
  }
  for (const group of spec.groups) {
    if (group.parent && !groupIds.has(group.parent)) {
      fail(entry.spec + " group " + group.id + " has unknown parent " + group.parent + ".");
    }
    if (group.parent === group.id) fail(entry.spec + " group " + group.id + " cannot parent itself.");
  }
  const edgeIds = new Set();
  for (const edge of spec.edges) {
    if (!edge.id || edgeIds.has(edge.id)) fail(entry.spec + " has a duplicate or empty edge id.");
    edgeIds.add(edge.id);
    if (!itemIds.has(edge.from) || !itemIds.has(edge.to)) {
      fail(entry.spec + " edge " + edge.id + " references an unknown item.");
    }
    if (!["straight", "orthogonal"].includes(edge.route)) {
      fail(entry.spec + " edge " + edge.id + " has unsupported route " + edge.route + ".");
    }
    if (Object.hasOwn(edge, "waypoints")) {
      if (!Array.isArray(edge.waypoints) || edge.waypoints.length === 0) {
        fail(entry.spec + " edge " + edge.id + " waypoints must be a non-empty array.");
      }
      for (const [index, waypoint] of edge.waypoints.entries()) {
        if (
          !waypoint
          || typeof waypoint !== "object"
          || Array.isArray(waypoint)
          || Object.keys(waypoint).sort().join(",") !== "x,y"
          || !Number.isFinite(waypoint.x)
          || !Number.isFinite(waypoint.y)
        ) {
          fail(entry.spec + " edge " + edge.id + " waypoint " + (index + 1) + " must contain exactly finite numeric x/y coordinates.");
        }
      }
    }
  }
}

function measureNode(node) {
  const titleLines = wrapText(node.title, 31, 2);
  const subtitleLines = wrapText(node.subtitle, 38, 2);
  const longest = Math.max(
    NODE_MIN_WIDTH - 48,
    ...titleLines.map((line) => estimatedWidth(line, 16.5, 600)),
    ...subtitleLines.map((line) => estimatedWidth(line, 13.25, 400)),
  );
  const width = clamp(Math.ceil(longest + 48), NODE_MIN_WIDTH, NODE_MAX_WIDTH);
  const textHeight = titleLines.length * 21 + subtitleLines.length * 18;
  const gap = titleLines.length && subtitleLines.length ? 6 : 0;
  const height = Math.max(NODE_MIN_HEIGHT, 28 + textHeight + gap);
  return {
    type: "node",
    id: node.id,
    width,
    height,
    titleLines,
    subtitleLines,
    relX: 0,
    relY: 0,
  };
}

function buildMeasuredTree(spec) {
  const groupById = new Map(spec.groups.map((group) => [group.id, group]));
  const nodeById = new Map(spec.nodes.map((node) => [node.id, node]));
  const childrenByGroup = new Map(spec.groups.map((group) => [group.id, []]));
  for (const group of spec.groups) {
    if (group.parent) childrenByGroup.get(group.parent).push({ type: "group", value: group });
  }
  for (const node of spec.nodes) {
    childrenByGroup.get(node.parent).push({ type: "node", value: node });
  }
  for (const children of childrenByGroup.values()) {
    children.sort((left, right) => {
      const order = Number(left.value.order || 0) - Number(right.value.order || 0);
      return order || left.value.id.localeCompare(right.value.id);
    });
  }

  const active = new Set();
  const measuredById = new Map();

  function measureGroup(groupId) {
    if (measuredById.has(groupId)) return measuredById.get(groupId);
    if (active.has(groupId)) fail(spec.id + " contains a group-parent cycle at " + groupId + ".");
    active.add(groupId);
    const group = groupById.get(groupId);
    const children = childrenByGroup.get(groupId).map((child) =>
      child.type === "group" ? measureGroup(child.value.id) : measureNode(child.value),
    );
    const headerHeight = group.parent ? NESTED_HEADER_HEIGHT : GROUP_HEADER_HEIGHT;
    const titleWidth = estimatedWidth(group.title, 18, 600);
    const subtitleWidth = estimatedWidth(group.subtitle, 12.5, 400);
    const kindWidth = estimatedWidth(kindLabel(group.kind), 10.5, 600);
    const headerMinimum = Math.ceil(Math.max(titleWidth + kindWidth + 78, subtitleWidth + 56, 316));
    let width;
    let height;
    if (group.layout === "horizontal") {
      const contentWidth = children.reduce((sum, child) => sum + child.width, 0)
        + Math.max(0, children.length - 1) * CHILD_GAP_HORIZONTAL;
      const contentHeight = Math.max(0, ...children.map((child) => child.height));
      width = Math.max(headerMinimum, contentWidth + GROUP_PADDING_X * 2);
      height = headerHeight + contentHeight + HORIZONTAL_GROUP_PADDING_BOTTOM;
      let cursorX = GROUP_PADDING_X;
      for (const child of children) {
        child.relX = cursorX;
        child.relY = headerHeight + (contentHeight - child.height) / 2;
        cursorX += child.width + CHILD_GAP_HORIZONTAL;
      }
    } else {
      const contentWidth = Math.max(0, ...children.map((child) => child.width));
      const contentHeight = children.reduce((sum, child) => sum + child.height, 0)
        + Math.max(0, children.length - 1) * CHILD_GAP_VERTICAL;
      width = Math.max(headerMinimum, contentWidth + GROUP_PADDING_X * 2);
      height = headerHeight + contentHeight + GROUP_PADDING_BOTTOM;
      let cursorY = headerHeight;
      for (const child of children) {
        child.relX = (width - child.width) / 2;
        child.relY = cursorY;
        cursorY += child.height + CHILD_GAP_VERTICAL;
      }
    }
    const measured = {
      type: "group",
      id: group.id,
      width: Math.ceil(width),
      height: Math.ceil(height),
      children,
      relX: 0,
      relY: 0,
    };
    measuredById.set(group.id, measured);
    active.delete(group.id);
    return measured;
  }

  const roots = spec.groups
    .filter((group) => !group.parent)
    .sort((left, right) => Number(left.order || 0) - Number(right.order || 0))
    .map((group) => measureGroup(group.id));

  return { roots, measuredById, groupById, nodeById };
}

function packRows(items, forceSingleColumn, maximumWidth) {
  if (items.length === 0) return { rows: [], width: 0, height: 0 };
  const rows = [];
  let row = [];
  let rowWidth = 0;
  for (const item of items) {
    const candidate = row.length === 0 ? item.width : rowWidth + ROOT_GAP + item.width;
    if (row.length > 0 && (forceSingleColumn || candidate > maximumWidth)) {
      rows.push(row);
      row = [item];
      rowWidth = item.width;
    } else {
      row.push(item);
      rowWidth = candidate;
    }
  }
  if (row.length) rows.push(row);
  const rowWidths = rows.map((current) =>
    current.reduce((sum, item) => sum + item.width, 0) + Math.max(0, current.length - 1) * ROOT_GAP,
  );
  const rowHeights = rows.map((current) => Math.max(...current.map((item) => item.height)));
  return {
    rows,
    rowWidths,
    rowHeights,
    width: Math.max(...rowWidths),
    height: rowHeights.reduce((sum, value) => sum + value, 0)
      + Math.max(0, rows.length - 1) * ROOT_ROW_GAP,
  };
}

function arrangeScene(spec, tree) {
  const applications = tree.roots.filter((root) => tree.groupById.get(root.id).kind === "application");
  const shared = tree.roots.filter((root) => tree.groupById.get(root.id).kind !== "application");
  const applicationMaximum = spec.layout.profile === "modular" ? 1040 : MAX_GRAPH_WIDTH;
  const modularColumns = spec.layout.profile === "modular" && shared.length > 0;
  const applicationSection = packRows(applications, modularColumns, applicationMaximum);
  const sharedVertical = spec.layout.profile !== "modular";
  const sharedSection = packRows(shared, sharedVertical || modularColumns, MAX_GRAPH_WIDTH);
  const needsOuterRails = applicationSection.rows.length > 1 && shared.length > 0;
  let graphWidth;
  let graphHeight;
  if (modularColumns) {
    graphWidth = applicationSection.width + MODULAR_COLUMN_GAP + sharedSection.width;
    graphHeight = Math.max(applicationSection.height, sharedSection.height);
  } else {
    const contentWidth = Math.max(applicationSection.width, sharedSection.width, 1);
    graphWidth = contentWidth + (needsOuterRails ? ROUTING_MARGIN * 2 : 0);
  }
  const rootPlacements = new Map();

  function placeSection(section, startY, sectionX, sectionWidth) {
    let y = startY;
    for (let rowIndex = 0; rowIndex < section.rows.length; rowIndex += 1) {
      const row = section.rows[rowIndex];
      const rowWidth = section.rowWidths[rowIndex];
      const rowHeight = section.rowHeights[rowIndex];
      let x = sectionX + (sectionWidth - rowWidth) / 2;
      for (const item of row) {
        rootPlacements.set(item.id, { x, y });
        x += item.width + ROOT_GAP;
      }
      y += rowHeight + ROOT_ROW_GAP;
    }
  }

  if (modularColumns) {
    placeSection(
      applicationSection,
      (graphHeight - applicationSection.height) / 2,
      0,
      applicationSection.width,
    );
    placeSection(
      sharedSection,
      (graphHeight - sharedSection.height) / 2,
      applicationSection.width + MODULAR_COLUMN_GAP,
      sharedSection.width,
    );
  } else {
    placeSection(applicationSection, 0, 0, graphWidth);
  }
  const applicationToSharedEdges = spec.edges.filter((edge) => {
    const source = tree.groupById.get(edge.from) || tree.nodeById.get(edge.from);
    const target = tree.groupById.get(edge.to) || tree.nodeById.get(edge.to);
    function rootKind(item) {
      let current = item;
      while (current && current.parent) current = tree.groupById.get(current.parent);
      return current ? current.kind : "";
    }
    return rootKind(source) === "application" && rootKind(target) === "shared";
  }).length;
  const routingGap = Math.max(SECTION_GAP, 58 + applicationToSharedEdges * 24);
  const sharedStart = applicationSection.height + (applications.length && shared.length ? routingGap : 0);
  if (!modularColumns) {
    placeSection(sharedSection, sharedStart, 0, graphWidth);
    graphHeight = shared.length
      ? sharedStart + sharedSection.height
      : applicationSection.height;
  }

  const geometry = new Map();
  function placeMeasured(measured, x, y, parent, rootId, depth) {
    const source = measured.type === "group"
      ? tree.groupById.get(measured.id)
      : tree.nodeById.get(measured.id);
    geometry.set(measured.id, {
      id: measured.id,
      type: measured.type,
      kind: source.kind,
      parent,
      rootId,
      depth,
      x: round(x),
      y: round(y),
      width: measured.width,
      height: measured.height,
      right: round(x + measured.width),
      bottom: round(y + measured.height),
      measured,
      source,
    });
    if (measured.type === "group") {
      for (const child of measured.children) {
        placeMeasured(child, x + child.relX, y + child.relY, measured.id, rootId, depth + 1);
      }
    }
  }

  for (const root of tree.roots) {
    const placement = rootPlacements.get(root.id);
    placeMeasured(root, placement.x, placement.y, null, root.id, 0);
  }

  return {
    width: Math.ceil(graphWidth),
    height: Math.ceil(graphHeight),
    geometry,
    groupById: tree.groupById,
    nodeById: tree.nodeById,
    applicationBottom: modularColumns
      ? (graphHeight + applicationSection.height) / 2
      : applicationSection.height,
    routingLeft: 16,
    routingRight: graphWidth - 16,
    modularColumns,
    appColumnRight: applicationSection.width,
    sharedColumnLeft: applicationSection.width + MODULAR_COLUMN_GAP,
    applicationToSharedEdges,
  };
}

function kindLabel(kind) {
  if (kind === "application") return "APPLICATION TARGET";
  if (kind === "shared") return "SHARED KMP MODULE";
  if (kind === "conceptual") return "APP-OWNED LAYER";
  return "PLATFORM MODULE";
}

function styleForKind(kind, isGroup) {
  if (kind === "application") {
    return {
      fill: isGroup ? COLORS.applicationFill : COLORS.applicationNodeFill,
      stroke: COLORS.applicationStroke,
      dash: "",
    };
  }
  if (kind === "shared") {
    return {
      fill: isGroup ? COLORS.sharedFill : COLORS.sharedNodeFill,
      stroke: COLORS.sharedStroke,
      dash: "",
    };
  }
  if (kind === "conceptual") {
    return {
      fill: isGroup ? COLORS.conceptualFill : COLORS.conceptualNodeFill,
      stroke: COLORS.conceptualStroke,
      dash: isGroup ? ' stroke-dasharray="7 6"' : "",
    };
  }
  return {
    fill: isGroup ? COLORS.platformFill : COLORS.platformNodeFill,
    stroke: COLORS.platformStroke,
    dash: "",
  };
}

function anchorPoint(geometry, anchor, counterpart) {
  const selected = anchor || (
    counterpart && counterpart.y >= geometry.bottom ? "bottom"
      : counterpart && counterpart.bottom <= geometry.y ? "top"
        : counterpart && counterpart.x >= geometry.right ? "right"
          : "left"
  );
  if (selected === "top") return { x: geometry.x + geometry.width / 2, y: geometry.y, anchor: selected };
  if (selected === "right") return { x: geometry.right, y: geometry.y + geometry.height / 2, anchor: selected };
  if (selected === "bottom") return { x: geometry.x + geometry.width / 2, y: geometry.bottom, anchor: selected };
  if (selected === "left") return { x: geometry.x, y: geometry.y + geometry.height / 2, anchor: selected };
  fail("Unsupported anchor " + selected + ".");
}

function topLevelAncestor(geometry, scene) {
  let current = geometry;
  while (current.parent) current = scene.geometry.get(current.parent);
  return current;
}

function commonParentBoundary(source, target, scene) {
  const sourceAncestors = new Set();
  let current = source;
  while (current) {
    sourceAncestors.add(current.id);
    current = current.parent ? scene.geometry.get(current.parent) : null;
  }
  current = target;
  while (current) {
    if (sourceAncestors.has(current.id)) return current;
    current = current.parent ? scene.geometry.get(current.parent) : null;
  }
  return null;
}

function compactPoints(points) {
  const compact = [];
  for (const point of points) {
    const rounded = { x: round(point.x), y: round(point.y) };
    const previous = compact[compact.length - 1];
    if (previous && previous.x === rounded.x && previous.y === rounded.y) continue;
    compact.push(rounded);
  }
  let changed = true;
  while (changed && compact.length > 2) {
    changed = false;
    for (let index = 1; index < compact.length - 1; index += 1) {
      const left = compact[index - 1];
      const point = compact[index];
      const right = compact[index + 1];
      if ((left.x === point.x && point.x === right.x) || (left.y === point.y && point.y === right.y)) {
        compact.splice(index, 1);
        changed = true;
        break;
      }
    }
  }
  return compact;
}

function routeEdge(edge, scene, edgeIndex, crossIndex, orthogonalIndex) {
  const sourceGeometry = scene.geometry.get(edge.from);
  const targetGeometry = scene.geometry.get(edge.to);
  const sourceRoot = topLevelAncestor(sourceGeometry, scene);
  const targetRoot = topLevelAncestor(targetGeometry, scene);
  const modularCross = scene.modularColumns
    && sourceRoot.id !== targetRoot.id
    && sourceRoot.kind === "application"
    && targetRoot.kind === "shared";
  const source = anchorPoint(
    sourceGeometry,
    edge.fromAnchor || (modularCross ? "right" : null),
    targetGeometry,
  );
  let target = anchorPoint(
    targetGeometry,
    edge.toAnchor || (modularCross ? "left" : null),
    sourceGeometry,
  );

  if (targetGeometry.type === "group" && target.anchor === "top" && sourceRoot.id !== targetRoot.id) {
    target = {
      ...target,
      x: clamp(sourceRoot.x + sourceRoot.width / 2, targetGeometry.x + 58, targetGeometry.right - 58),
    };
  }
  if (
    targetGeometry.type === "group" &&
    (target.anchor === "left" || target.anchor === "right") &&
    sourceRoot.id !== targetRoot.id
  ) {
    target = {
      ...target,
      y: clamp(
        sourceRoot.y + sourceRoot.height / 2,
        targetGeometry.y + 62,
        targetGeometry.bottom - 62,
      ),
    };
  }

  const specifiedWaypoints = Array.isArray(edge.waypoints)
    ? edge.waypoints.map((point) => ({ x: point.x, y: point.y }))
    : [];

  if (edge.route === "straight") {
    const vertical = (source.anchor === "bottom" || source.anchor === "top")
      && (target.anchor === "bottom" || target.anchor === "top");
    const horizontal = (source.anchor === "left" || source.anchor === "right")
      && (target.anchor === "left" || target.anchor === "right");
    if (vertical && Math.abs(source.x - target.x) > 0.2) {
      fail(edge.id + " is declared straight but its vertical endpoints are not aligned.");
    }
    if (horizontal && Math.abs(source.y - target.y) > 0.2) {
      fail(edge.id + " is declared straight but its horizontal endpoints are not aligned.");
    }
    const points = compactPoints([source, ...specifiedWaypoints, target]);
    const collinear = vertical
      ? points.every((point) => Math.abs(point.x - source.x) <= 0.2)
      : points.every((point) => Math.abs(point.y - source.y) <= 0.2);
    if (!collinear) fail(edge.id + " has waypoints that bend a straight route.");
    return points;
  }

  if (specifiedWaypoints.length > 0) {
    const points = compactPoints([source, ...specifiedWaypoints, target]);
    const orthogonal = points.every((point, index) => {
      if (index === 0) return true;
      const previous = points[index - 1];
      return Math.abs(point.x - previous.x) <= 0.2 || Math.abs(point.y - previous.y) <= 0.2;
    });
    if (!orthogonal) {
      fail(
        edge.id + " has waypoints that create a diagonal segment: " +
        JSON.stringify({ source, waypoints: specifiedWaypoints, target }),
      );
    }
    return points;
  }

  const sameRoot = sourceRoot.id === targetRoot.id;
  const applicationToShared = !sameRoot && sourceRoot.kind === "application" && targetRoot.kind === "shared";
  const verticalFlow = ["top", "bottom"].includes(source.anchor)
    && ["top", "bottom"].includes(target.anchor);
  if (verticalFlow) {
    const sourceDown = target.y >= source.y;
    const exitY = source.y + (sourceDown ? 18 : -18);
    const enterY = target.y + (sourceDown ? -18 : 18);

    if (sameRoot && Math.abs(source.x - target.x) < 0.2) {
      const boundary = commonParentBoundary(sourceGeometry, targetGeometry, scene) || sourceRoot;
      const useRight = orthogonalIndex % 2 === 0;
      const corridorX = useRight ? boundary.right - 14 : boundary.x + 14;
      return compactPoints([
        source,
        { x: source.x, y: exitY },
        { x: corridorX, y: exitY },
        { x: corridorX, y: enterY },
        { x: target.x, y: enterY },
        target,
      ]);
    }

    if (applicationToShared) {
      const useRight = targetRoot.x + targetRoot.width / 2 >= sourceRoot.x + sourceRoot.width / 2;
      const corridorX = useRight ? sourceRoot.right - 14 : sourceRoot.x + 14;
      const targetTrack = Math.min(
        scene.applicationBottom + 38 + Math.max(0, crossIndex) * 24,
        target.y - 28,
      );
      if (sourceRoot.bottom < scene.applicationBottom - 1) {
        const outerRail = sourceRoot.x + sourceRoot.width / 2 < scene.width / 2
          ? scene.routingLeft
          : scene.routingRight;
        return compactPoints([
          source,
          { x: source.x, y: exitY },
          { x: corridorX, y: exitY },
          { x: corridorX, y: sourceRoot.bottom + 18 },
          { x: outerRail, y: sourceRoot.bottom + 18 },
          { x: outerRail, y: targetTrack },
          { x: target.x, y: targetTrack },
          target,
        ]);
      }
      return compactPoints([
        source,
        { x: source.x, y: exitY },
        { x: corridorX, y: exitY },
        { x: corridorX, y: targetTrack },
        { x: target.x, y: targetTrack },
        target,
      ]);
    }

    const midpoint = round((source.y + target.y) / 2 + ((edgeIndex % 3) - 1) * 14);
    return compactPoints([
      source,
      { x: source.x, y: midpoint },
      { x: target.x, y: midpoint },
      target,
    ]);
  }

  const sourceRight = target.x >= source.x;
  const exitX = source.x + (sourceRight ? 18 : -18);
  const enterX = target.x + (sourceRight ? -18 : 18);
  if (sameRoot && Math.abs(source.y - target.y) < 0.2) {
    const boundary = commonParentBoundary(sourceGeometry, targetGeometry, scene) || sourceRoot;
    const corridorY = boundary.bottom - 16;
    return compactPoints([
      source,
      { x: exitX, y: source.y },
      { x: exitX, y: corridorY },
      { x: enterX, y: corridorY },
      { x: enterX, y: target.y },
      target,
    ]);
  }
  if (applicationToShared && scene.modularColumns) {
    const corridorX = sourceRight ? sourceRoot.right - 14 : sourceRoot.x + 14;
    const laneCount = Math.max(1, scene.applicationToSharedEdges);
    const laneMinimum = scene.appColumnRight + 24;
    const laneMaximum = scene.sharedColumnLeft - 24;
    const lane = laneMinimum + (laneMaximum - laneMinimum) *
      ((Math.max(0, crossIndex) + 1) / (laneCount + 1));
    const trackX = sourceRight ? lane : scene.sharedColumnLeft - (lane - scene.appColumnRight);
    return compactPoints([
      source,
      { x: exitX, y: source.y },
      { x: corridorX, y: source.y },
      { x: trackX, y: source.y },
      { x: trackX, y: target.y },
      { x: enterX, y: target.y },
      target,
    ]);
  }
  const midpoint = round((source.x + target.x) / 2 + ((edgeIndex % 3) - 1) * 14);
  return compactPoints([
    source,
    { x: exitX, y: source.y },
    { x: midpoint, y: source.y },
    { x: midpoint, y: target.y },
    { x: enterX, y: target.y },
    target,
  ]);
}

function pathData(points, offsetX, offsetY) {
  return points
    .map((point, index) =>
      (index === 0 ? "M" : "L") + round(point.x + offsetX) + " " + round(point.y + offsetY),
    )
    .join(" ");
}

function rectanglesOverlap(left, right, padding = 0) {
  return left.x < right.x + right.width + padding
    && left.x + left.width + padding > right.x
    && left.y < right.y + right.height + padding
    && left.y + left.height + padding > right.y;
}

function segmentIntersectsBounds(start, end, bounds, padding = 0) {
  const left = bounds.x - padding;
  const right = bounds.x + bounds.width + padding;
  const top = bounds.y - padding;
  const bottom = bounds.y + bounds.height + padding;
  if (start.x === end.x) {
    return start.x > left && start.x < right
      && Math.max(Math.min(start.y, end.y), top) < Math.min(Math.max(start.y, end.y), bottom);
  }
  if (start.y === end.y) {
    return start.y > top && start.y < bottom
      && Math.max(Math.min(start.x, end.x), left) < Math.min(Math.max(start.x, end.x), right);
  }
  return true;
}

function labelBounds(x, y, anchor, lines) {
  const width = Math.ceil(Math.max(...lines.map((line) => estimatedWidth(line, EDGE_LABEL_FONT_SIZE, 600))) + 4);
  const height = 19 + Math.max(0, lines.length - 1) * EDGE_LABEL_LINE_HEIGHT;
  const left = anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
  return { x: round(left), y: round(y - 14), width, height };
}

function edgeLabelPosition(points, label, edgeId, routedEdges, scene, occupiedLabels) {
  if (!label || points.length < 2) return null;
  const lines = wrapText(label, 30, 2);
  const segments = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const length = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
    if (length >= 30) segments.push({ start, end, length, index, horizontal: start.y === end.y });
  }
  if (segments.length === 0) return null;
  segments.sort((left, right) => {
    const leftPreferred = left.horizontal && left.length >= 58 ? 1 : 0;
    const rightPreferred = right.horizontal && right.length >= 58 ? 1 : 0;
    return rightPreferred - leftPreferred || right.length - left.length || right.index - left.index;
  });

  const candidates = [];
  const fractions = [0.5, 0.33, 0.67, 0.18, 0.82, 0.08, 0.92];
  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
    const segment = segments[segmentIndex];
    for (const fraction of fractions) {
      const point = {
        x: segment.start.x + (segment.end.x - segment.start.x) * fraction,
        y: segment.start.y + (segment.end.y - segment.start.y) * fraction,
      };
      if (segment.horizontal) {
        const blockOffset = Math.max(0, lines.length - 1) * EDGE_LABEL_LINE_HEIGHT;
        const offsets = [-14 - blockOffset, 25, -34 - blockOffset, 45, -54 - blockOffset, 65];
        for (const [sideIndex, offset] of offsets.entries()) {
          const x = point.x;
          const y = point.y + offset;
          candidates.push({
            x,
            y,
            anchor: "middle",
            lines,
            bounds: labelBounds(x, y, "middle", lines),
            preference: segmentIndex * 20 + sideIndex * 5 + Math.abs(fraction - 0.5) * 12,
          });
        }
      } else {
        const y = point.y - Math.max(0, lines.length - 1) *
          (EDGE_LABEL_LINE_HEIGHT / 2) + 5;
        const sides = [18, -18, 34, -34, 50, -50];
        for (const [sideIndex, offset] of sides.entries()) {
          const x = point.x + offset;
          const anchor = offset > 0 ? "start" : "end";
          candidates.push({
            x,
            y,
            anchor,
            lines,
            bounds: labelBounds(x, y, anchor, lines),
            preference: segmentIndex * 20 + sideIndex * 5 + Math.abs(fraction - 0.5) * 12,
          });
        }
      }
    }
  }

  const nodeBounds = [...scene.geometry.values()]
    .filter((item) => item.type === "node")
    .map((item) => ({ x: item.x, y: item.y, width: item.width, height: item.height }));
  const groupBorders = [...scene.geometry.values()]
    .filter((item) => item.type === "group")
    .flatMap((item) => {
      const headerHeight = item.parent ? NESTED_HEADER_HEIGHT : GROUP_HEADER_HEIGHT;
      return [
        [{ x: item.x, y: item.y }, { x: item.right, y: item.y }],
        [{ x: item.right, y: item.y }, { x: item.right, y: item.bottom }],
        [{ x: item.right, y: item.bottom }, { x: item.x, y: item.bottom }],
        [{ x: item.x, y: item.bottom }, { x: item.x, y: item.y }],
        [
          { x: item.x, y: item.y + headerHeight - 9 },
          { x: item.right, y: item.y + headerHeight - 9 },
        ],
      ];
    });
  function score(candidate) {
    let value = candidate.preference;
    const bounds = candidate.bounds;
    if (bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > scene.width ||
        bounds.y + bounds.height > scene.height) value += 100000;
    for (const node of nodeBounds) {
      if (rectanglesOverlap(bounds, node, 1)) value += 10000;
    }
    for (const [start, end] of groupBorders) {
      if (segmentIntersectsBounds(start, end, bounds, 2)) value += 2000;
    }
    for (const route of routedEdges) {
      if (route.edge.id === edgeId) continue;
      for (let index = 0; index < route.points.length - 1; index += 1) {
        if (segmentIntersectsBounds(route.points[index], route.points[index + 1], bounds, 2)) {
          value += 1000;
        }
      }
    }
    for (const occupied of occupiedLabels) {
      if (rectanglesOverlap(bounds, occupied, 5)) value += 5000;
    }
    return value;
  }
  return candidates.reduce((best, candidate) => score(candidate) < score(best) ? candidate : best);
}

function fontStyle() {
  return [
    '@font-face{font-family:"Inter";font-style:normal;font-weight:400;src:url("data:font/woff2;base64,',
    regularWoff2,
    '") format("woff2");}',
    '@font-face{font-family:"Inter";font-style:normal;font-weight:600;src:url("data:font/woff2;base64,',
    semiboldWoff2,
    '") format("woff2");}',
    'text{font-family:"Inter","Segoe UI",Arial,sans-serif;font-kerning:normal;font-feature-settings:"cv02","cv03","cv04","cv11";}',
  ].join("");
}

function renderGroupBackgrounds(scene, offsetX, offsetY) {
  return [...scene.geometry.values()]
    .filter((item) => item.type === "group")
    .sort((left, right) => left.depth - right.depth)
    .map((item) => {
      const style = styleForKind(item.kind, true);
      const x = round(item.x + offsetX);
      const y = round(item.y + offsetY);
      return '<rect data-group-fill="' + escapeXml(item.id) + '" data-bounds="' +
        [x, y, item.width, item.height].join(",") + '" x="' + x + '" y="' + y +
        '" width="' + item.width + '" height="' + item.height + '" rx="' +
        (item.depth === 0 ? 10 : 8) + '" fill="' + style.fill + '" stroke="none"/>';
    })
    .join("");
}

function renderGroupForegrounds(scene, offsetX, offsetY) {
  return [...scene.geometry.values()]
    .filter((item) => item.type === "group")
    .sort((left, right) => left.depth - right.depth)
    .map((item) => {
      const style = styleForKind(item.kind, true);
      const x = round(item.x + offsetX);
      const y = round(item.y + offsetY);
      const headerHeight = item.parent ? NESTED_HEADER_HEIGHT : GROUP_HEADER_HEIGHT;
      const titleLines = wrapText(item.source.title, 34, 2);
      const subtitleLines = wrapText(item.source.subtitle, 44, 1);
      const titleY = y + 29;
      const headerKind = kindLabel(item.kind);
      const headerCollision =
        estimatedWidth(titleLines[0] || "", 17, 600) +
        estimatedWidth(headerKind, 10, 600) > item.width - 66;
      const kindY = headerCollision ? y + 52 : y + 27;
      const title = titleLines.map((line, index) =>
        '<tspan x="' + (x + 20) + '" dy="' + (index === 0 ? 0 : 20) + '">' + escapeXml(line) + "</tspan>",
      ).join("");
      const subtitleY = titleY + titleLines.length * 20 + 4;
      const subtitle = subtitleLines.map((line, index) =>
        '<tspan x="' + (x + 20) + '" dy="' + (index === 0 ? 0 : 17) + '">' + escapeXml(line) + "</tspan>",
      ).join("");
      return '<g data-group-id="' + escapeXml(item.id) + '">' +
        '<rect x="' + x + '" y="' + y + '" width="' + item.width + '" height="' + item.height +
        '" rx="' + (item.depth === 0 ? 10 : 8) + '" fill="none" stroke="' + style.stroke +
        '" stroke-width="' + (item.depth === 0 ? 1.25 : 1.1) + '"' + style.dash + '/>' +
        '<line x1="' + (x + 1) + '" y1="' + (y + headerHeight - 9) + '" x2="' +
        (x + item.width - 1) + '" y2="' + (y + headerHeight - 9) + '" stroke="' +
        style.stroke + '" stroke-opacity=".17"/>' +
        '<text x="' + (x + 20) + '" y="' + titleY + '" font-size="17" font-weight="600" fill="' +
        style.stroke + '">' + title + '</text>' +
        (subtitle ? '<text x="' + (x + 20) + '" y="' + subtitleY +
          '" font-size="12.5" font-weight="400" fill="' + COLORS.muted + '">' + subtitle + '</text>' : "") +
        '<text x="' + (x + item.width - 18) + '" y="' + kindY +
        '" text-anchor="end" font-size="10" font-weight="600" letter-spacing="1" fill="' +
        style.stroke + '">' + headerKind + '</text></g>';
    })
    .join("");
}

function renderNodes(scene, offsetX, offsetY) {
  return [...scene.geometry.values()]
    .filter((item) => item.type === "node")
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((item) => {
      const style = styleForKind(item.kind, false);
      const x = round(item.x + offsetX);
      const y = round(item.y + offsetY);
      const titleLines = item.measured.titleLines;
      const subtitleLines = item.measured.subtitleLines;
      const contentHeight = titleLines.length * 21 + subtitleLines.length * 18 +
        (titleLines.length && subtitleLines.length ? 6 : 0);
      let cursorY = y + (item.height - contentHeight) / 2 + 15;
      const title = titleLines.map((line) => {
        const markup = '<tspan x="' + (x + 20) + '" y="' + round(cursorY) + '">' + escapeXml(line) + "</tspan>";
        cursorY += 21;
        return markup;
      }).join("");
      if (titleLines.length && subtitleLines.length) cursorY += 5;
      const subtitle = subtitleLines.map((line) => {
        const markup = '<tspan x="' + (x + 20) + '" y="' + round(cursorY) + '">' + escapeXml(line) + "</tspan>";
        cursorY += 18;
        return markup;
      }).join("");
      return '<g data-node-id="' + escapeXml(item.id) + '" data-bounds="' +
        [x, y, item.width, item.height].join(",") + '">' +
        '<rect x="' + x + '" y="' + y + '" width="' + item.width + '" height="' + item.height +
        '" rx="7" fill="' + style.fill + '" stroke="' + style.stroke + '" stroke-width="1.15"/>' +
        '<text font-size="16.5" font-weight="600" fill="' + style.stroke + '">' + title + '</text>' +
        (subtitle ? '<text font-size="13" font-weight="400" fill="' + COLORS.muted + '">' +
          subtitle + '</text>' : "") +
        '</g>';
    })
    .join("");
}

function renderEdges(spec, scene, offsetX, offsetY) {
  const paths = [];
  const labels = [];
  const repeatedLabels = new Map();
  for (const edge of spec.edges) {
    if (!edge.label) continue;
    const key = edge.to + "\u0000" + edge.label;
    const matches = repeatedLabels.get(key) || [];
    matches.push(edge.id);
    repeatedLabels.set(key, matches);
  }
  let crossIndex = 0;
  let orthogonalIndex = 0;
  const routedEdges = spec.edges.map((edge, index) => {
    const sourceRoot = topLevelAncestor(scene.geometry.get(edge.from), scene);
    const targetRoot = topLevelAncestor(scene.geometry.get(edge.to), scene);
    const isApplicationToShared = sourceRoot.id !== targetRoot.id
      && sourceRoot.kind === "application"
      && targetRoot.kind === "shared";
    const currentOrthogonalIndex = edge.route === "orthogonal" ? orthogonalIndex : -1;
    if (edge.route === "orthogonal") orthogonalIndex += 1;
    const points = routeEdge(
      edge,
      scene,
      index,
      isApplicationToShared ? crossIndex : -1,
      currentOrthogonalIndex,
    );
    if (isApplicationToShared) crossIndex += 1;
    return { edge, points };
  });
  for (const { edge, points } of routedEdges) {
    const pointText = points
      .map((point) => round(point.x + offsetX) + "," + round(point.y + offsetY))
      .join(" ");
    paths.push(
      '<path data-edge-id="' + escapeXml(edge.id) + '" data-from="' + escapeXml(edge.from) +
      '" data-to="' + escapeXml(edge.to) + '" data-route="' + edge.route +
      '" data-route-points="' + pointText + '" d="' + pathData(points, offsetX, offsetY) +
      '" fill="none" stroke="' + COLORS.arrow +
      '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrowhead)"/>',
    );
  }
  const occupiedLabels = [];
  for (const { edge, points } of routedEdges) {
    const repeatedKey = edge.to + "\u0000" + (edge.label || "");
    const repeated = repeatedLabels.get(repeatedKey) || [];
    const repeatedPosition = repeated.indexOf(edge.id);
    const representativePosition = scene.modularColumns
      ? repeated.length - 1
      : Math.floor(repeated.length / 2);
    const showLabel = repeated.length <= 1 || repeatedPosition === representativePosition;
    const label = edgeLabelPosition(
      points,
      showLabel ? edge.label : "",
      edge.id,
      routedEdges,
      scene,
      occupiedLabels,
    );
    if (label) {
      const x = round(label.x + offsetX);
      const y = round(label.y + offsetY);
      const bounds = {
        x: round(label.bounds.x + offsetX),
        y: round(label.bounds.y + offsetY),
        width: label.bounds.width,
        height: label.bounds.height,
      };
      const tspans = label.lines.map((line, lineIndex) =>
        '<tspan x="' + x + '" dy="' + (lineIndex === 0 ? 0 : EDGE_LABEL_LINE_HEIGHT) + '">' + escapeXml(line) + "</tspan>",
      ).join("");
      labels.push(
        '<text data-edge-label="' + escapeXml(edge.id) + '" x="' + x + '" y="' + y +
        '" data-bounds="' + [bounds.x, bounds.y, bounds.width, bounds.height].join(",") +
        '" text-anchor="' + label.anchor + '" font-size="' + EDGE_LABEL_FONT_SIZE + '" font-weight="600" fill="' +
        COLORS.arrow + '">' + tspans + '</text>',
      );
      occupiedLabels.push(label.bounds);
    }
  }
  return '<g data-edge-paths="true">' + paths.join("") + '</g><g data-edge-labels="true">' +
    labels.join("") + "</g>";
}

function legendMarkup(x, y) {
  const items = [
    ["Application target", COLORS.applicationFill, COLORS.applicationStroke, ""],
    ["Platform code", COLORS.platformFill, COLORS.platformStroke, ""],
    ["Shared KMP", COLORS.sharedFill, COLORS.sharedStroke, ""],
    ["App-owned layer", COLORS.conceptualFill, COLORS.conceptualStroke, ' stroke-dasharray="5 4"'],
  ];
  return '<g data-diagram-legend="true">' +
    '<rect x="' + (x - 18) + '" y="' + (y - 18) + '" width="448" height="116" rx="8" fill="#FFFFFF" stroke="' +
    COLORS.divider + '" stroke-width="1"/>' +
    '<text x="' + x + '" y="' + y + '" font-size="9.5" font-weight="600" letter-spacing="1.1" fill="' +
    COLORS.faint + '">VISUAL KEY</text>' +
    items.map((item, index) => {
      const itemX = x + (index % 2) * 222;
      const itemY = y + 25 + Math.floor(index / 2) * 31;
      return '<rect x="' + itemX + '" y="' + (itemY - 12) +
        '" width="24" height="15" rx="3" fill="' + item[1] + '" stroke="' + item[2] +
        '" stroke-width="1.1"' + item[3] + '/><text x="' + (itemX + 34) + '" y="' + itemY +
        '" font-size="11.5" font-weight="400" fill="' + COLORS.muted + '">' + item[0] + "</text>";
    }).join("") +
    '<path d="M' + x + " " + (y + 88) + "H" + (x + 24) +
    '" fill="none" stroke="' + COLORS.arrow + '" stroke-width="1.8" marker-end="url(#arrowhead)"/>' +
    '<text x="' + (x + 34) + '" y="' + (y + 92) +
    '" font-size="11.5" font-weight="400" fill="' + COLORS.muted + '">Call / dependency</text></g>';
}

function rootSvgOpen(width, height, titleId, descriptionId, design, fingerprint) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height +
    '" viewBox="0 0 ' + width + " " + height +
    '" role="img" aria-labelledby="' + titleId + " " + descriptionId +
    '" data-diagram-design="' + design + '" data-render-input-sha256="' + fingerprint +
    '" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">';
}

function definitions() {
  return '<defs><style>' + fontStyle() + '</style>' +
    '<marker id="arrowhead" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M1 1L9 5L1 9Z" fill="' + COLORS.arrow + '"/></marker></defs>';
}

function renderFull(spec, entry, scene, fingerprint) {
  const canvasWidth = Math.ceil(Math.max(1440, scene.width + 96));
  const graphOffsetX = Math.max(48, (canvasWidth - scene.width) / 2);
  const headerHeight = 170;
  const graphOffsetY = headerHeight + 30;
  const canvasHeight = Math.ceil(graphOffsetY + scene.height + 52);
  const titleId = "diagram-" + spec.id + "-title";
  const descriptionId = "diagram-" + spec.id + "-description";
  const number = String(spec.number).padStart(2, "0");
  const subtitleLines = wrapText(spec.subtitle, 78, 2);
  const subtitle = subtitleLines.map((line, index) =>
    '<tspan x="54" dy="' + (index === 0 ? 0 : 20) + '">' + escapeXml(line) + "</tspan>",
  ).join("");
  return rootSvgOpen(canvasWidth, canvasHeight, titleId, descriptionId, DESIGN_FULL, fingerprint) +
    definitions() +
    '<title id="' + titleId + '">' + escapeXml(number + " · " + spec.title) + '</title>' +
    '<desc id="' + descriptionId + '">' + escapeXml(spec.subtitle + " Solid arrows show calls or dependencies.") + '</desc>' +
    '<rect width="' + canvasWidth + '" height="' + canvasHeight + '" fill="' + COLORS.canvas + '"/>' +
    '<g data-document-header="true">' +
    '<text x="54" y="32" font-size="9.5" font-weight="600" letter-spacing="1.3" fill="' + COLORS.faint +
    '">KMP ARCHITECTURE · ' + escapeXml(String(spec.category).toUpperCase()) + '</text>' +
    '<text x="54" y="72" font-size="30" font-weight="600" fill="' + COLORS.ink + '">' +
    escapeXml(number + " · " + spec.title) + '</text>' +
    '<text x="54" y="100" font-size="13.5" font-weight="400" fill="' + COLORS.muted + '">' + subtitle + '</text>' +
    '<text x="54" y="145" font-size="9.5" font-weight="600" letter-spacing=".8" fill="' + COLORS.faint + '">' +
    escapeXml(String(entry.sample).toUpperCase()) + '</text>' +
    legendMarkup(canvasWidth - 500, 34) +
    '<line x1="54" y1="169" x2="' + (canvasWidth - 54) + '" y2="169" stroke="' + COLORS.divider + '"/>' +
    '</g>' +
    renderGroupBackgrounds(scene, graphOffsetX, graphOffsetY) +
    renderEdges(spec, scene, graphOffsetX, graphOffsetY) +
    renderGroupForegrounds(scene, graphOffsetX, graphOffsetY) +
    renderNodes(scene, graphOffsetX, graphOffsetY) +
    "</svg>";
}

function renderPreview(spec, scene, fingerprint) {
  const canvasWidth = Math.ceil(scene.width + OUTER_GRAPH_PADDING * 2);
  const canvasHeight = Math.ceil(scene.height + OUTER_GRAPH_PADDING * 2);
  const titleId = "diagram-" + spec.id + "-preview-title";
  const descriptionId = "diagram-" + spec.id + "-preview-description";
  const number = String(spec.number).padStart(2, "0");
  return rootSvgOpen(canvasWidth, canvasHeight, titleId, descriptionId, DESIGN_PREVIEW, fingerprint) +
    definitions() +
    '<title id="' + titleId + '">' + escapeXml(number + " · " + spec.title) + '</title>' +
    '<desc id="' + descriptionId + '">' + escapeXml(spec.subtitle + " Cropped architecture preview.") + '</desc>' +
    '<rect width="' + canvasWidth + '" height="' + canvasHeight + '" fill="' + COLORS.canvasPreview + '"/>' +
    renderGroupBackgrounds(scene, OUTER_GRAPH_PADDING, OUTER_GRAPH_PADDING) +
    renderEdges(spec, scene, OUTER_GRAPH_PADDING, OUTER_GRAPH_PADDING) +
    renderGroupForegrounds(scene, OUTER_GRAPH_PADDING, OUTER_GRAPH_PADDING) +
    renderNodes(scene, OUTER_GRAPH_PADDING, OUTER_GRAPH_PADDING) +
    "</svg>";
}

function pngFromSvg(svg, width) {
  const renderer = new Resvg(svg, {
    fitTo: { mode: "width", value: width * 2 },
    font: {
      fontFiles,
      loadSystemFonts: false,
      defaultFontFamily: "Inter",
      sansSerifFamily: "Inter",
    },
    shapeRendering: 2,
    textRendering: 2,
  });
  return renderer.render().asPng();
}

function renderFingerprint(spec, entry) {
  return createHash("sha256")
    .update(JSON.stringify(spec))
    .update(JSON.stringify(entry))
    .update(rendererSource)
    .update(fontFingerprint)
    .update(DESIGN_FULL)
    .update(DESIGN_PREVIEW)
    .digest("hex");
}

function verifyOrWrite(relativePath, contents, stale) {
  const outputPath = path.join(diagramsDir, relativePath);
  if (checkOnly) {
    const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath) : Buffer.alloc(0);
    const expected = Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
    if (!current.equals(expected)) stale.push(path.relative(repoRoot, outputPath));
    return;
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, contents);
}

const stale = [];
for (const entry of manifest) {
  const specPath = path.join(diagramsDir, entry.spec);
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  validateSpec(spec, entry);
  const tree = buildMeasuredTree(spec);
  const scene = arrangeScene(spec, tree);
  const fingerprint = renderFingerprint(spec, entry);
  const fullSvg = renderFull(spec, entry, scene, fingerprint);
  const previewSvg = renderPreview(spec, scene, fingerprint);
  const fullWidth = Number(fullSvg.match(/\bwidth="([0-9]+)"/)[1]);
  const previewWidth = Number(previewSvg.match(/\bwidth="([0-9]+)"/)[1]);
  verifyOrWrite(entry.image, fullSvg, stale);
  verifyOrWrite(entry.preview, previewSvg, stale);
  verifyOrWrite(entry.png, pngFromSvg(fullSvg, fullWidth), stale);
  verifyOrWrite(entry.previewPng, pngFromSvg(previewSvg, previewWidth), stale);
}

if (stale.length > 0) {
  console.error("Generated diagram assets are stale:\n" + stale.map((file) => "- " + file).join("\n"));
  console.error("Run npm run render.");
  process.exit(1);
}

console.log(
  (checkOnly ? "Verified " : "Rendered ") + manifest.length +
  " SVG diagrams, " + manifest.length + " README previews, and matching 2x PNG exports.",
);
