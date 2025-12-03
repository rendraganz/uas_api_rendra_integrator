import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = 3036;

const linkVendorA = "https://vendor-a-minumanfahmi.vercel.app/vendor_a/minuman";
const linkVendorB = "https://vendorbdistro.vercel.app/distro";
const linkVendorC = "https://prakuasvendorcnaza.vercel.app/menu";

app.get("/", (req, res) => {
    res.send("Mall Kidul Kali");
});

app.get("/gabungan", async (req, res) => {
    try {
        const [responseA, responseB, responseC] = await Promise.all([
            fetch(linkVendorA),
            fetch(linkVendorB),
            fetch(linkVendorC)
        ]);

        const dataA = await responseA.json();
        const dataB = await responseB.json();
        const dataC = await responseC.json();

        // vendor a
        const vendorA = dataA.map(item => ({
            id: item.kd_produk,
            nama: item.nm_brg,
            harga_final: Math.floor(parseInt(item.hrg) * 0.9),
            status: item.ket_stok === "ada" ? "Tersedia" : "Habis",
            vendor: "Vendor A"
        }));

        // vendor b
        const vendorB = dataB.map(item => ({
            id: item.sku,
            nama: item.productName,
            harga_final: item.price,
            status: item.isAvailable ? "Tersedia" : "Habis",
            vendor: "Vendor B"
        }));

        // vendor c
        const vendorC = dataC.map((item) => {
            const hargaFinal = item.pricing.base_price + item.pricing.tax;
            const namaProduk = item.details.category === "Food" ? `${item.details.name} (Recomended)` : item.details.name;

            return {
                id: String(item.id),
                nama: namaProduk,
                harga_final: hargaFinal,
                status: item.stock > 0 ? "Tersedia" : "Habis",
                vendor: "Vendor C"
            };
        });

        const finalData = [...vendorA, ...vendorB, ...vendorC];
        res.json(finalData);
    } catch (err) {
        res.status(500).json({ error: "Gagal memproses data", detail: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/gabungan`);
});