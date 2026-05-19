plugins {
            alias(libs.plugins.android.application)
    alias(libs.plugins.compose.compiler)
        }

        android {
            namespace = "com.example.kmpsamples.modularkmpuilayer.android"
            compileSdk = libs.versions.compile.sdk.get().toInt()

            defaultConfig {
                applicationId = "com.example.kmpsamples.modularkmpuilayer.android"
                minSdk = libs.versions.min.sdk.get().toInt()
                targetSdk = libs.versions.target.sdk.get().toInt()
                versionCode = 1
                versionName = "1.0"
            }
            buildFeatures {
                compose = true
            }
        }


dependencies {
    implementation(libs.androidx.activity.compose)
    implementation(project(":featureTwoSharedUI"))
}

