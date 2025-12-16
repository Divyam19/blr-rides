import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const knowledgeBaseData = [
  {
    category: "Traffic Rules",
    question: "What are the speed limits for bikes in Bangalore?",
    answer: "In Bangalore, the speed limit for two-wheelers is 50 km/h in city areas and 60 km/h on highways. Always follow posted speed limit signs and adjust your speed based on traffic conditions.",
    tags: ["speed limit", "traffic", "bangalore", "safety"]
  },
  {
    category: "Traffic Rules",
    question: "Is lane splitting legal in Bangalore?",
    answer: "Lane splitting (riding between lanes) is not explicitly legal in India. While it's commonly practiced, it can be dangerous and may result in fines. It's safer to stay in your lane and follow traffic flow.",
    tags: ["lane splitting", "traffic", "safety", "legal"]
  },
  {
    category: "Safety",
    question: "What safety gear is mandatory for bike riders?",
    answer: "Mandatory safety gear includes: 1) Helmet (ISI certified), 2) Valid driving license, 3) Vehicle registration certificate, 4) Insurance certificate, 5) Pollution Under Control (PUC) certificate. Additional recommended gear includes gloves, knee pads, and reflective clothing.",
    tags: ["safety", "helmet", "gear", "mandatory"]
  },
  {
    category: "Safety",
    question: "What should I do if I'm involved in a bike accident?",
    answer: "If involved in an accident: 1) Stay calm and check for injuries, 2) Call emergency services (108 for ambulance, 100 for police), 3) Do not move injured persons unless necessary, 4) Exchange contact and insurance information with other parties, 5) Take photos of the scene, 6) File a police report if required, 7) Seek medical attention even for minor injuries.",
    tags: ["accident", "safety", "emergency", "legal"]
  },
  {
    category: "Traffic Rules",
    question: "Can I ride a bike without a valid license?",
    answer: "No, riding without a valid driving license is illegal and can result in fines up to ₹5,000 and/or imprisonment up to 3 months. You must have a valid two-wheeler license (LMV-T) to ride a bike legally.",
    tags: ["license", "legal", "traffic rules"]
  },
  {
    category: "Traffic Rules",
    question: "What are the rules for parking bikes in Bangalore?",
    answer: "Bike parking rules: 1) Park only in designated parking areas, 2) Do not park on footpaths or blocking traffic, 3) Follow parking meter rules where applicable, 4) Do not park near intersections or bus stops, 5) Ensure your vehicle doesn't obstruct other vehicles or pedestrians. Violations can result in fines.",
    tags: ["parking", "traffic rules", "bangalore"]
  },
  {
    category: "Safety",
    question: "How often should I service my bike?",
    answer: "Regular bike maintenance schedule: 1) Oil change every 2,000-3,000 km or 3 months, 2) Chain cleaning and lubrication every 500-1,000 km, 3) Brake inspection every 5,000 km, 4) Tire pressure check weekly, 5) Full service every 6 months or 5,000-6,000 km. Follow your bike's manual for specific recommendations.",
    tags: ["maintenance", "service", "safety", "bike care"]
  },
  {
    category: "Traffic Rules",
    question: "Can I carry a pillion rider without a helmet?",
    answer: "No, both the rider and pillion passenger must wear ISI-certified helmets. Violating this rule can result in a fine of ₹1,000 and suspension of driving license for 3 months. This is mandatory for safety.",
    tags: ["helmet", "pillion", "safety", "traffic rules"]
  },
  {
    category: "Safety",
    question: "What should I check before every ride?",
    answer: "Pre-ride safety checklist: 1) Tire pressure and condition, 2) Brake functionality (front and rear), 3) Lights (headlight, tail light, indicators), 4) Fuel level, 5) Chain tension and lubrication, 6) Mirrors adjustment, 7) Helmet and safety gear, 8) Documents (license, RC, insurance, PUC).",
    tags: ["safety", "pre-ride", "checklist", "maintenance"]
  },
  {
    category: "Traffic Rules",
    question: "What is the fine for not wearing a helmet?",
    answer: "The fine for not wearing a helmet is ₹1,000 for the first offense. Subsequent violations can result in higher fines and possible license suspension. Both rider and pillion must wear helmets.",
    tags: ["helmet", "fine", "traffic rules", "legal"]
  },
  {
    category: "Safety",
    question: "How should I ride in heavy rain?",
    answer: "Riding in rain safety tips: 1) Reduce speed significantly, 2) Increase following distance, 3) Avoid sudden braking or acceleration, 4) Use both brakes gently, 5) Avoid puddles and painted road markings, 6) Wear waterproof gear, 7) Use headlight for visibility, 8) Be extra cautious at intersections, 9) Consider pulling over if visibility is poor.",
    tags: ["rain", "safety", "weather", "riding tips"]
  },
  {
    category: "Traffic Rules",
    question: "Can I use mobile phone while riding?",
    answer: "No, using a mobile phone while riding is illegal and extremely dangerous. The fine is ₹5,000 for the first offense and ₹10,000 for subsequent violations. Use hands-free devices if absolutely necessary, but it's best to pull over safely to make calls.",
    tags: ["mobile phone", "traffic rules", "safety", "legal"]
  },
]

async function main() {
  console.log("Seeding knowledge base...")

  for (const item of knowledgeBaseData) {
    await prisma.rulesKnowledgeBase.upsert({
      where: {
        category_question: {
          category: item.category,
          question: item.question,
        },
      },
      update: {},
      create: item,
    })
  }

  console.log("Knowledge base seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
