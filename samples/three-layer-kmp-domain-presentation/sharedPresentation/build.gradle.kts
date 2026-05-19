import org.jetbrains.kotlin.gradle.dsl.JvmTarget

    plugins {
        alias(libs.plugins.kotlin.multiplatform)
alias(libs.plugins.android.kotlin.multiplatform.library)
    }

    kotlin {
        android {
            namespace = "com.example.kmpsamples.threelayerkmpdomainpresentation.sharedpresentation"
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
                baseName = "SharedPresentation"
                isStatic = true
                export(project(":sharedDomain"))
            }
        }

        sourceSets {
            commonMain.dependencies {
                api(project(":sharedDomain"))
            }
        }

    }
