import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const PORT = config.port || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("🗄️ Database connected successfully");

    if (config.node_env !== "production") {
      // 🟢 Local / Development Mode: Express HTTP Server চালু হবে
      app.listen(PORT, () => {
        console.log(`🚀 Local Server is running on http://localhost:${PORT}`);
      });
    } else {
     
      console.log("⚡ Serverless Application initialized for Production (Vercel)");
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

export default app;