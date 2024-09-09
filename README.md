# kmp-sample-diagrams

Sample diagrams when using Kotlin Multiplatform to be able to visualize how Kotlin Multiplatform
can be added to exisitng project.

# I. Adding KMP

## 1. Normal Approach

This approach showcase when iOS and android development is being created separately.

![Main](main.png)

## 2-1. KMP - Native UI

This approach showcase when you use Kotlin Multiplatform without updating the implementation
of the UI screens depending on their platform.

![Kotlin Multiplatform](kmp_main.png)

## 2-2. KMP - Compose Multiplatform

This approach showcase using both Kotlin Multiplatform and Compose Multiplatform to be able to
reuse UI components in both Android and iOS.

![Kotlin Multiplatform](kmp_main_compose.png)

## 3. Main with UI and Data Layer

This showcase how you can layer your project into two (UI and Data Layer). This will help
on refactoring specific layer if needed.

![Main](main_with_layer.png)

## 4. KMP - Data Layer

Here is an example using Kotlin Multiplatform in the Data Layer.

![Kotlin Multiplatform - Data Layer](kmp_data_layer.png)

## 5. KMP - Presentation Layer

Here is an example using Kotlin Multiplatform in the Presentation Layer (ViewModel and UI screens).

![Kotlin Multiplatform - Presentation Layer](kmp_presentation_layer.png)

## 6. KMP - UI Layer

Here is an example using Kotlin Multiplatform in the UI only (Compose Multiplatform).

![Kotlin Multiplatform - UI Layer](kmp_ui_layer.png)

## 7. KMP - Presentation and Data Layer

Here is an example when using Kotlin Multiplatform in both layers. (Presentation and Data Layer)

![Kotlin Multiplatform - UI and Data Layer](kmp_data_ui_layer.png)

# II. Adding KMP in Multiple Modules

## 1. Main Modular Approach

![Kotlin Multiplatform Modular](main_with_modules.png)

## 2. KMP - Data Layer (Modular)

![Kotlin Multiplatform - Data Layer (Modular)](kmp_module_data_layer.png)

## 3. KMP - Presentation Layer (Modular)

![Kotlin Multiplatform - Presentation Layer (Modular)](kmp_module_presentation_layer.png)

## 4. KMP - UI Layer (Modular)

![Kotlin Multiplatform - UI Layer (Modular)](kmp_module_ui_layer.png)

## 5. KMP - UI and Data Layer (Modular)

![Kotlin Multiplatform - UI and Data Layer (Modular)](kmp_module_ui_data_layer.png)

## 6. KMP - Shared Module (Modular)

![Kotlin Multiplatform Module](kmp_module.png)

# III. Adding KMP that has Three Layers 

## 1. Three Layer Approach

![Main - Three Layers](main_three_layers.png)

## 2-1. KMP - Domain Layer

![KMP - Domain Layer](kmp_three_layers_domain_layer.png)

## 2-2. KMP - Domain Layer (Simple Version)

![KMP - Domain Layer (Simple)](kmp_three_layers_domain_layer_simple.png)

## 3. KMP - Domain and Data Layer

![KMP - Domain and Data Layer](kmp_three_layer_domain_data_layer.png)

## 4. KMP - Domain and Presentation Layer

![KMP - Domain and Presentation Layer](kmp_three_layer_domain_presentation_layer.png)
