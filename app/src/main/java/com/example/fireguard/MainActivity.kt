package com.example.fireguard
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.pusher.client.Pusher
import com.pusher.client.PusherOptions
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val deviceAdmin = ComponentName(this, AdminReceiver::class.java)
        if (!dpm.isAdminActive(deviceAdmin)) {
            val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, deviceAdmin)
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Proteccion remota activa.")
            startActivity(intent)
        }
        val options = PusherOptions().setCluster("us2")
        val pusher = Pusher("43b3675a0d7078d24ecc", options)
        pusher.connect()
        val channel = pusher.subscribe("private-canal-seguridad")
        channel.bind("client-orden-bloqueo") { _ ->
            runOnUiThread { if (dpm.isAdminActive(deviceAdmin)) dpm.lockNow() }
        }
    }
}
