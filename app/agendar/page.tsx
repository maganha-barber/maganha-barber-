import { NewBookingForm } from "@/components/NewBookingForm";

export default function AgendarPage() {
  return (
    <div className="w-full min-h-screen py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewBookingForm />
      </div>
    </div>
  );
}
