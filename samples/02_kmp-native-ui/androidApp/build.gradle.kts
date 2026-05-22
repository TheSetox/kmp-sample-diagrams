plugins {
            alias(libs.plugins.android.application)
        }

        android {
            namespace = "com.example.kmpsamples.kmpnativeui.android"
            compileSdk = libs.versions.compile.sdk.get().toInt()

            defaultConfig {
                applicationId = "com.example.kmpsamples.kmpnativeui.android"
                minSdk = libs.versions.min.sdk.get().toInt()
                targetSdk = libs.versions.target.sdk.get().toInt()
                versionCode = 1
                versionName = "1.0"
            }

        }


dependencies {
    implementation(project(":sharedLogic"))
}

