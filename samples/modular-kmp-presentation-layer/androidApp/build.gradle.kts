plugins {
            alias(libs.plugins.android.application)
        }

        android {
            namespace = "com.example.kmpsamples.modularkmppresentationlayer.android"
            compileSdk = libs.versions.compile.sdk.get().toInt()

            defaultConfig {
                applicationId = "com.example.kmpsamples.modularkmppresentationlayer.android"
                minSdk = libs.versions.min.sdk.get().toInt()
                targetSdk = libs.versions.target.sdk.get().toInt()
                versionCode = 1
                versionName = "1.0"
            }

        }


dependencies {
    implementation(project(":featureTwoSharedPresentation"))
}

