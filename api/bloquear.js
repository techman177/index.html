export default async function handler(req, res) {
    // Tomamos los datos aunque vengan por pedrada (query) o por mensaje (body)
    const deviceId = req.query.deviceId || (req.body && req.body.deviceId);
    const accion = req.query.accion || (req.body && req.body.accion);
    const apiKey = process.env.SCALEFUSION_API_KEY;

    // Si no llega el ID, no molestamos a Scalefusion
    if (!deviceId || !accion) {
        return res.status(400).json({ error: "Falta el ID del equipo o la acción" });
    }

    try {
        // Usamos la URL oficial de Scalefusion
        const response = await fetch(`https://app.scalefusion.com/api/v1/devices/${deviceId}/${accion}.json`, {
            method: 'POST',
            headers: { 
                'Authorization': `Token ${apiKey}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({}) // El paquete vacío que ellos exigen
        });

        if (response.ok) {
            res.status(200).json({ status: "success" }); // ¡Con C, mi hermano!
        } else {
            const errorData = await response.json();
            res.status(400).json({ status: "error", detail: errorData });
        }
    } catch (error) {
        res.status(500).json({ status: "server_error", message: error.message });
    }
}
