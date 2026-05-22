plugins {
        alias(libs.plugins.kotlin.jvm)
        alias(libs.plugins.compose.multiplatform)
        alias(libs.plugins.compose.compiler)
    }

    kotlin {
        jvmToolchain(17)
    }

    dependencies {
        implementation(compose.desktop.currentOs)
implementation(compose.material3)
implementation(compose.foundation)
implementation(project(":sharedDomain"))
    }

    compose.desktop {
        application {
            mainClass = "com.example.kmpsamples.threelayerkmpdomain.desktop.MainKt"
        }
    }
