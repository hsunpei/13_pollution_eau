export default function PollutionMapLegend() {
  const legendItems = [
    {
      color: "bg-red-400",
      text: "Au moins 1 PFAS > valeur sanitaire"
    },
    {
      color: "bg-orange-400",
      text: "Somme des 20 PFAS > 0,1 μg/L"
    },
    {
      color: "bg-yellow-300",
      text: "Sommes des 20 PFAS < 0,1 μg/L et la somme des 4 PFAS (PFOA, PFOS, PFNA, PFHxS) > 0.02 μg/L"
    },
    {
      color: "bg-green-300",
      text: "Au moins 1 paramètre a été quantifié mais la somme des 20 PFAS < 0,1 μg/L et la sommes des 4 PFAS < 0,02 μg/L"
    },
    {
      color: "bg-gray-300",
      text: "Aucun paramètre n'a été quantifié"
    },
    {
      color: "bg-white border border-gray-300 border-dashed",
      text: "Non recherchés"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">PFAS</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-6 h-6 flex-shrink-0 rounded ${item.color} mt-1`}></div>
            <span className="text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>

      <p className="text-gray-600 mt-4">
        Lorem ipsum dolor sit amet consectetur. Eget porta mauris mattis venenatis.
      </p>
    </div>
  );
};
