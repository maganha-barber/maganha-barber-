import { Scissors } from "lucide-react";

export default function Icon() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#D4AF37", // Cor dourada (gold-500)
      }}
    >
      <Scissors
        size={64}
        strokeWidth={2.5}
        color="#1C1C1C" // Cor escura para contraste
      />
    </div>
  );
}
