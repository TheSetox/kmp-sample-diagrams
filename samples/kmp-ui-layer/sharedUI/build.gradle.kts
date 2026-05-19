import org.jetbrains.kotlin.gradle.dsl.JvmTarget

    plugins {
        alias(libs.plugins.kotlin.multiplatform)
alias(libs.plugins.android.kotlin.multiplatform.library)
alias(libs.plugins.compose.multiplatform)
alias(libs.plugins.compose.compiler)
    }

    kotlin {
        android {
            namespace = "com.example.kmpsamples.kmpuilayer.sharedui"
            compileSdk = libs.versions.compile.sdk.get().toInt()
            minSdk = libs.versions.min.sdk.get().toInt()
            compilerOptions {
                jvmTarget.set(JvmTarget.JVM_17)
            }
        }

        jvm("desktop") {
            compilerOptions {
                jvmTarget.set(JvmTarget.JVM_17)
            }
        }

        listOf(
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
            iosTarget.binaries.framework {
                baseName = "SharedUI"
                isStatic = true
            }
        }

        sourceSets {
            commonMain.dependencies {
                implementation(compose.runtime)
        implementation(compose.foundation)
        implementation(compose.material3)
        implementation(compose.ui)
            }
        }

    }
