export const puppies = [
  {
    id: 1,
    name: "Max",
    dob: "2025-11-15",
    gender: "Male",
    color: "Black & Tan",
    parents: "Bruno x Bella",
    vaccinated: true,
    dewormed: true,
    microchipped: false,
    price: "Contact for price",
    status: "available",
    images: ["/puppies/p1.jpg"],
    description:
      "Excellent temperament, working line genetics with strong protective instincts",
  },
  {
    id: 2,
    name: "Luna",
    dob: "2025-11-20",
    gender: "Female",
    color: "Sable",
    parents: "Bruno x Bella",
    vaccinated: true,
    dewormed: true,
    microchipped: false,
    price: "Contact for price",
    status: "reserved",
    images: ["/puppies/p2.jpg"],
    description:
      "Show quality, beautiful markings with exceptional intelligence",
  },
  {
    id: 3,
    name: "Thor",
    dob: "2025-12-01",
    gender: "Male",
    color: "Solid Black",
    parents: "Bruno x Bella",
    vaccinated: true,
    dewormed: true,
    microchipped: true,
    price: "Contact for price",
    status: "available",
    images: ["/puppies/p3.jpg"],
    description:
      "Strong build, protective instinct, ideal for family protection",
  },
  {
    id: 4,
    name: "Thor",
    dob: "2025-12-01",
    gender: "Male",
    color: "Solid Black",
    parents: "Bruno x Bella",
    vaccinated: true,
    dewormed: true,
    microchipped: true,
    price: "Contact for price",
    status: "available",
    images: ["/puppies/p4.jpg"],
    description:
      "Strong build, protective instinct, ideal for family protection",
  },
  {
    id: 5,
    name: "Thor",
    dob: "2025-12-01",
    gender: "Male",
    color: "Solid Black",
    parents: "Bruno x Bella",
    vaccinated: true,
    dewormed: true,
    microchipped: true,
    price: "Contact for price",
    status: "available",
    images: ["/puppies/p5.jpg"],
    description:
      "Strong build, protective instinct, ideal for family protection",
  },
  {
    id: 6,
    name: "Thor",
    dob: "2025-12-01",
    gender: "Male",
    color: "Solid Black",
    parents: "Bruno x Bella",
    vaccinated: true,
    dewormed: true,
    microchipped: true,
    price: "Contact for price",
    status: "available",
    images: ["/puppies/p6.jpg"],
    description:
      "Strong build, protective instinct, ideal for family protection",
  },
];

export const addPuppy = (puppy) => {
  puppies.push({ ...puppy, id: Date.now() });
};

export const updatePuppy = (id, updatedData) => {
  const index = puppies.findIndex((p) => p.id === id);
  if (index !== -1) {
    puppies[index] = { ...puppies[index], ...updatedData };
  }
};

export const deletePuppy = (id) => {
  const index = puppies.findIndex((p) => p.id === id);
  if (index !== -1) {
    puppies.splice(index, 1);
  }
};
