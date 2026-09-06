# 04. Layered Native

Baseline layered architecture. Each app target owns presentation and data layers. These layers are app-owned code groupings, not separate build modules. Presentation contains UI and ViewModel; there is no domain/use-case layer in this scenario.

[![Layered Native architecture diagram preview](previews/04-layered-native.svg)](images/04-layered-native.svg)

[Full SVG](images/04-layered-native.svg) · [PNG @2x](images/04-layered-native@2x.png) · [Preview PNG @2x](previews/04-layered-native@2x.png)

[Diagram specification](specs/04-layered-native.json) · [Runnable sample](../samples/04_layered-native/)
