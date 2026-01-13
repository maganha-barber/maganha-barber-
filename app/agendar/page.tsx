import { BookingForm } from "@/components/BookingForm";
import { Calendar } from "lucide-react";

export default function AgendarPage() {
  return (
    <div className="w-full min-h-screen py-12 bg-gradient-soft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-gold-500" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Agendar Horário
          </h1>
          <div className="w-20 h-0.5 bg-gold-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg">
            Escolha seu serviço, barbeiro e horário preferido
          </p>
        </div>
        <BookingForm />
      </div>
    </div>
  );
}
