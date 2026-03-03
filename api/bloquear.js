export default async function handler(req, res) {
  const { deviceId, accion } = req.query;
  const apiKey = process.env.SCALEFUSION_API_KEY;

  if (!deviceId || !accion) return res.status(400).json({ error: "Faltan parámetros" });

  try {
    const response = await fetch(`https://api.scalefusion.com/api/v1/devices/${deviceId}/${accion}.json`, {
      method: 'POST',
      headers: { 'Authorization': `Token ${apiKey}`, 'Content-Type': 'application/json' }
    });
    if (response.ok) res.status(200).json({ status: "success" });
    else res.status(400).json({ status: "error" });
  } catch (error) { res.status(500).json({ status: "server_error" }); }
}