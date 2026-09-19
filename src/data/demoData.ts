/**
 * PROJECT AFTERLIFE - Comprehensive Seed / Demo Data
 * Contains realistic student projects across EV, Disaster Management, Healthcare,
 * Agriculture, and Smart Cities, plus mentors, industries, funders, and initial states.
 */

import { 
  Project, 
  UserProfile, 
  Milestone, 
  CollaborationRecord, 
  SystemNotification,
  ProjectFusionIdea,
  EcosystemStats 
} from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user_student_1',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@mit.edu',
    phone: '+1 (555) 234-5678',
    role: 'student',
    college: 'MIT School of Engineering',
    department: 'Electrical Engineering & Computer Science',
    year: '4th Year',
    skills: ['IoT', 'Embedded C++', 'Python', 'GIS', 'LoRaWAN'],
    areasOfInterest: ['Disaster Resilience', 'Smart Sensing', 'Climate Tech'],
    location: 'Boston, MA',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Hackathon finalist at National Climate Hack. Passionate about building early warning hardware that survives extreme weather.',
    createdAt: '2026-08-10T10:00:00Z',
    isVerified: true
  },
  {
    id: 'user_student_2',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@stanford.edu',
    phone: '+1 (555) 876-5432',
    role: 'student',
    college: 'Stanford University',
    department: 'Materials Science & AI Lab',
    year: 'Masters 2nd Year',
    skills: ['Battery Chemistry', 'PyTorch', 'CAN Bus', 'Thermal Modeling'],
    areasOfInterest: ['Electric Vehicles', 'Clean Energy', 'Battery Safety'],
    location: 'Palo Alto, CA',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Developing edge AI models to predict thermal runaway in EV lithium-ion battery packs 40 minutes before it happens.',
    createdAt: '2026-08-12T11:30:00Z',
    isVerified: true
  },
  {
    id: 'user_student_3',
    fullName: 'Kofi Mensah',
    email: 'kofi.mensah@agritech.edu',
    phone: '+1 (555) 345-9876',
    role: 'student',
    college: 'CalPoly State University',
    department: 'Agricultural & Bio-Resource Engineering',
    year: 'Senior (4th Year)',
    skills: ['Computer Vision', 'YOLOv10', 'Drone PX4', 'Embedded Linux'],
    areasOfInterest: ['Precision Agriculture', 'Automated Farming', 'Food Security'],
    location: 'San Luis Obispo, CA',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Built low-cost multispectral camera attachment for standard drones with real-time on-device blight detection.',
    createdAt: '2026-08-15T09:15:00Z',
    isVerified: true
  },
  {
    id: 'user_student_4',
    fullName: 'Maya Lin',
    email: 'maya.lin@jhu.edu',
    phone: '+1 (555) 432-1098',
    role: 'student',
    college: 'Johns Hopkins University',
    department: 'Biomedical Engineering',
    year: '3rd Year',
    skills: ['IMU Sensors', 'TensorFlow Lite', 'React Native', 'Signal Processing'],
    areasOfInterest: ['Digital Health', 'Neurorehabilitation', 'Assistive Wearables'],
    location: 'Baltimore, MD',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Winner of MedHacks 2026. Developing wearable IMU sleeve for post-stroke home physical therapy guided by adaptive AI.',
    createdAt: '2026-08-20T14:40:00Z',
    isVerified: true
  },
  {
    id: 'user_student_5',
    fullName: 'David Chen',
    email: 'david.chen@gatech.edu',
    phone: '+1 (555) 654-3210',
    role: 'student',
    college: 'Georgia Institute of Technology',
    department: 'Civil & Urban Informatics',
    year: '4th Year',
    skills: ['C++', 'SUMO Simulator', 'V2X Wireless', 'Edge Computing'],
    areasOfInterest: ['Smart Cities', 'Intelligent Traffic', 'Autonomous Fleets'],
    location: 'Atlanta, GA',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Creating decentralized mesh intersection controller reducing rush-hour idling emissions by 34%.',
    createdAt: '2026-08-25T16:20:00Z',
    isVerified: true
  },
  // Mentors
  {
    id: 'user_mentor_1',
    fullName: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@climate-resilience.org',
    role: 'mentor',
    title: 'Chief Scientist, Sensor Systems',
    organizationName: 'Global Resilience Institute',
    skills: ['IoT', 'Embedded Systems', 'Smart Cities', 'Hydrological Modeling'],
    areasOfInterest: ['Disaster Management', 'Sensors', 'Government Deployment'],
    location: 'Boulder, CO',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: '18+ years mentoring university teams into commercially validated environmental sensor networks. Former NOAA fellow.',
    createdAt: '2026-07-01T08:00:00Z',
    isVerified: true
  },
  {
    id: 'user_mentor_2',
    fullName: 'Marcus Vance',
    email: 'marcus.v@hyperion-battery.com',
    role: 'mentor',
    title: 'Director of Battery Systems & BMS',
    organizationName: 'Hyperion Energy Labs',
    skills: ['BMS Architecture', 'Thermal Runaway', 'UL 1973 Certification', 'Automotive ISO 26262'],
    areasOfInterest: ['Electric Vehicles', 'Grid Storage', 'Hardware Validation'],
    location: 'Detroit, MI',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    bio: 'Seasoned automotive powertrain engineer. Passionate about helping student battery innovations reach automotive pilot tracks.',
    createdAt: '2026-07-10T12:00:00Z',
    isVerified: true
  },
  {
    id: 'user_mentor_3',
    fullName: 'Dr. Ananya Roy',
    email: 'ananya.roy@healthtech-accelerator.io',
    role: 'mentor',
    title: 'Lead Clinical Investigator & MedTech Advisor',
    organizationName: 'BioVenture MedTech Hub',
    skills: ['FDA 510(k)', 'Clinical Trials', 'Biomedical Signal Processing', 'IRB Approvals'],
    areasOfInterest: ['Digital Therapeutics', 'Wearables', 'Rehabilitation'],
    location: 'Boston, MA',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Assisted 14 academic projects navigate IRB approvals and secure early phase clinical pilot hospital partnerships.',
    createdAt: '2026-07-15T09:00:00Z',
    isVerified: true
  },
  // Industry Partners
  {
    id: 'user_industry_1',
    fullName: 'VoltGrid Mobility Corp',
    email: 'partnerships@voltgridmobility.com',
    role: 'industry',
    title: 'Open Innovation Director',
    organizationName: 'VoltGrid Mobility',
    skills: ['EV Powertrain', 'Fleet Telematics', 'High-Voltage Prototyping'],
    areasOfInterest: ['EV Battery Testing', 'Fast Charging', 'Fleet Safety'],
    location: 'Fremont, CA',
    photoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    bio: 'Tier-1 EV tier components maker offering test bench access, high-precision thermal cyclers, and fleet validation pilots.',
    createdAt: '2026-07-20T10:00:00Z',
    isVerified: true
  },
  {
    id: 'user_industry_2',
    fullName: 'TerraAg Precision Robotics',
    email: 'innovations@terraag-robotics.com',
    role: 'industry',
    title: 'VP of Technology Scouting',
    organizationName: 'TerraAg Industries',
    skills: ['Autonomous Tractors', 'Multispectral Imaging', 'Farm Field Trials'],
    areasOfInterest: ['Crop Health', 'Drone Swarms', 'Smart Agriculture'],
    location: 'Des Moines, IA',
    photoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=150&auto=format&fit=crop&q=80',
    bio: 'Agricultural technology conglomerate providing 5,000+ acres of real farm test beds and commercial distribution access.',
    createdAt: '2026-07-22T14:00:00Z',
    isVerified: true
  },
  {
    id: 'user_industry_3',
    fullName: 'CivicMesh Smart Infrastructure',
    email: 'partners@civicmesh.gov-tech.io',
    role: 'industry',
    title: 'Head of Smart Cities Partnerships',
    organizationName: 'CivicMesh Infrastructure',
    skills: ['Smart Intersections', 'Municipal Corridors', 'DSRC Wireless'],
    areasOfInterest: ['Urban Mobility', 'Disaster Early Warning', 'Municipal Trials'],
    location: 'Austin, TX',
    photoUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=150&auto=format&fit=crop&q=80',
    bio: 'Partnering with 12 metropolitan transit authorities to deploy and test municipal edge computing solutions.',
    createdAt: '2026-07-25T15:00:00Z',
    isVerified: true
  },
  // Institutions
  {
    id: 'user_inst_1',
    fullName: 'National Resilience Testing Center',
    email: 'accreditation@nrtc.resilience.gov',
    role: 'institution',
    title: 'Director of University Liaison',
    organizationName: 'NRTC Innovation Gateway',
    skills: ['Climatic Chambers', 'Wind/Flood Simulation', 'Standardization'],
    areasOfInterest: ['Disaster Tech', 'Environmental Sensors', 'Safety Standards'],
    location: 'Boulder, CO',
    photoUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=150&auto=format&fit=crop&q=80',
    bio: 'Federal research laboratory providing free calibrated testing tanks and simulated hurricane wind tunnels for approved academic projects.',
    createdAt: '2026-07-05T09:00:00Z',
    isVerified: true
  },
  {
    id: 'user_inst_2',
    fullName: 'Pacific Clean Energy Consortium',
    email: 'grants@pcec-consortium.edu',
    role: 'institution',
    title: 'Academic Technology Transfer Dean',
    organizationName: 'Pacific Clean Energy Consortium',
    skills: ['IP Licensing', 'Incubation', 'University Tech Transfer'],
    areasOfInterest: ['Battery Safety', 'Clean Tech', 'Student Spinouts'],
    location: 'Berkeley, CA',
    photoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    bio: 'Inter-university alliance funding seed commercialization milestones and IP legal protection for student inventors.',
    createdAt: '2026-07-08T11:00:00Z',
    isVerified: true
  },
  // Funding Organizations
  {
    id: 'user_funder_1',
    fullName: 'NextGen Student Frontier Fund',
    email: 'proposals@nextgen-frontier.vc',
    role: 'funder',
    title: 'Managing Partner',
    organizationName: 'NextGen Frontier Ventures',
    skills: ['Non-Dilutive Grants', 'Seed Equity', 'Founder Matchmaking'],
    areasOfInterest: ['DeepTech', 'Climate Hardware', 'AI Healthcare'],
    location: 'New York, NY',
    photoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
    bio: '$25M specialized endowment providing $25k-$100k non-dilutive translation grants to promising hackathon prototypes.',
    createdAt: '2026-07-12T13:00:00Z',
    isVerified: true
  },
  {
    id: 'user_funder_2',
    fullName: 'Urban Horizon Impact Capital',
    email: 'invest@urbanhorizon.fund',
    role: 'funder',
    title: 'Chief Investment Officer',
    organizationName: 'Urban Horizon Capital',
    skills: ['Catalytic Capital', 'Government Co-Funding', 'Municipal Procurement'],
    areasOfInterest: ['Smart Cities', 'Agriculture AI', 'Resilience'],
    location: 'Chicago, IL',
    photoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&auto=format&fit=crop&q=80',
    bio: 'Dedicated impact fund matching municipal civic budgets to deployed student municipal pilot installations.',
    createdAt: '2026-07-14T14:30:00Z',
    isVerified: true
  },
  // Administrator
  {
    id: 'user_admin_1',
    fullName: 'Dr. Jonathan Reynolds',
    email: 'admin@ideatec.org',
    role: 'admin',
    title: 'Platform Director & Chief Steward',
    organizationName: 'IdeaTec National Steering Committee',
    skills: ['System Governance', 'Ecosystem Matching', 'Academic Accreditations'],
    areasOfInterest: ['All Domains', 'Student Entrepreneurship', 'Ethics & Safety'],
    location: 'Washington, DC',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bio: 'Steward of the National Student Innovation Revival Initiative. Overseeing project transitions from hackathon to real impact.',
    createdAt: '2026-06-01T00:00:00Z',
    isVerified: true
  }
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj_flood_1',
    ownerId: 'user_student_1',
    ownerName: 'Aarav Sharma',
    ownerCollege: 'MIT School of Engineering',
    title: 'JalDrishti',
    category: 'Hardware & IoT',
    domain: 'Disaster Management',
    problemStatement: 'Flash floods cause over $40B in annual global damages. Most municipal river sensors are expensive ($12k/unit), sparse, and rely on cellular towers that fail during severe tropical storms, leaving downstream communities with zero advance warning.',
    proposedSolution: 'An ultra-low-power, solar-harvesting acoustic river-gauge sensor network that meshes via LoRaWAN. Operates for 5 years without maintenance and transmits hydrological surge warnings directly to localized sirens and municipal GIS dashboards even when cellular and power grids collapse.',
    innovationDescription: 'Combines low-cost ultrasonic surface profiling with micro-radar Doppler flow telemetry on a custom $45 PCB, analyzed by on-device TinyML microcontrollers running a hydrostatic anomaly classifier.',
    technologies: ['AI', 'IoT', 'GIS', 'LoRaWAN', 'TinyML', 'C++'],
    programmingLanguages: ['C++', 'Python', 'TypeScript'],
    hardwareUsed: ['ESP32-S3', 'JSN-SR04T Ultrasonic', '24GHz Doppler Radar', 'Semtech SX1262 LoRa'],
    aiMlUsed: ['TinyML Anomaly Classifier', 'TensorFlow Lite for Microcontrollers'],
    githubRepo: 'https://github.com/ideatec-demo/jaldrishti-mesh',
    demoUrl: 'https://jaldrishti.demo-ideatec.org',
    stage: 'prototype',
    requirements: ['Mentorship', 'Field Testing', 'Funding'],
    files: [
      {
        name: 'SmartFlood_NationalHack_FinalPresentation.pptx',
        type: 'ppt',
        url: 'https://example.com/files/smartflood-presentation.pptx',
        sizeBytes: 14200000,
        uploadedAt: '2026-08-11T12:00:00Z'
      },
      {
        name: 'Acoustic_Hydrology_FieldTesting_Report.pdf',
        type: 'pdf',
        url: 'https://example.com/files/acoustic-hydrology.pdf',
        sizeBytes: 4800000,
        uploadedAt: '2026-08-11T12:05:00Z'
      },
      {
        name: 'Hardware_PCB_Enclosure_Render.png',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        sizeBytes: 2100000,
        uploadedAt: '2026-08-11T12:10:00Z'
      }
    ],
    projectDNA: {
      domain: 'Disaster Management',
      technologies: ['IoT', 'TinyML', 'LoRaWAN', 'GIS', 'C++', 'Python'],
      problem: 'Flash flood sensor network collapse and high cost of existing municipal gauging stations',
      solution: 'Decentralized LoRaWAN acoustic river level and water surge monitoring with on-device TinyML anomaly alerts',
      developmentStage: 'prototype',
      requiredSkills: ['Hydrological Engineering', 'Embedded C++', 'GIS Mapping', 'Radio Frequency Certification'],
      requiredResources: ['National Water Channel Testing Tank', 'Emergency Management Agency Mentor', '$35k Seed Grant'],
      potentialUsers: ['Municipal Disaster Management Authorities', 'National Weather Services', 'Downstream Riverside Communities'],
      possibleApplications: ['Flash flood warning sirens', 'Dam spillway automation', 'Agricultural irrigation canal monitoring'],
      keywords: ['flood', 'disaster', 'lorawan', 'tinyml', 'mesh', 'river', 'hydrology', 'early warning']
    },
    maturityAssessment: {
      currentStage: 'prototype',
      numericLevel: 2,
      nextRecommendedStage: 'tested',
      reason: 'The benchtop hardware and software stack works reliably under simulated data; however, sensor calibration under high-debris water flow and outdoor UV/water ingress requires a controlled flume or wave-tank testing facility before municipal pilot trials.',
      confidenceScore: 89,
      maturityFactors: {
        codeMaturity: 78,
        hardwareValidation: 62,
        userTesting: 45,
        marketReadiness: 38
      },
      disclaimer: 'AI-assisted project maturity assessment based on repository contents, hardware specifications, and validation logs.'
    },
    needsNext: [
      {
        id: 'need_1',
        type: 'Testing Facility',
        title: 'Calibrated Water Flume & Environmental Stress Chamber',
        reason: 'Validate ultrasonic sensor accuracy under turbulent floating debris and water surface foam.',
        priority: 'high'
      },
      {
        id: 'need_2',
        type: 'Mentor',
        title: 'Municipal Emergency Management Specialist',
        reason: 'Align alert payload schemas with standard FEMA/CAP (Common Alerting Protocol) telemetry standards.',
        priority: 'high'
      },
      {
        id: 'need_3',
        type: 'Funding',
        title: 'Component Manufacturing Seed Grant ($25,000)',
        reason: 'Manufacture 30 weatherproof solar node enclosures for first riverbed cluster pilot deployment.',
        priority: 'medium'
      }
    ],
    isDiscoverable: true,
    createdAt: '2026-08-11T11:45:00Z',
    updatedAt: '2026-09-02T16:10:00Z',
    mentorId: 'user_mentor_1',
    mentorName: 'Dr. Sarah Jenkins',
    viewCount: 142
  },
  {
    id: 'proj_ev_battery_2',
    ownerId: 'user_student_2',
    ownerName: 'Elena Rostova',
    ownerCollege: 'Stanford University',
    title: 'SentientCell: Predictive EV Battery Thermal Runaway AI',
    category: 'CleanTech & AI',
    domain: 'Electric Vehicles',
    problemStatement: 'Lithium-ion EV batteries can experience sudden thermal runaway from micro-dendrite growth or internal separator faults. Existing Battery Management Systems (BMS) only detect thermal runaway after temperatures spike catastrophically (under 60 seconds before ignition).',
    proposedSolution: 'SentientCell utilizes high-frequency electrochemical impedance spectroscopy (EIS) signatures and an edge transformer model to detect sub-surface dendrite nucleation up to 40 minutes prior to heat venting, allowing safe driver evacuation and automated coolant flood triggering.',
    innovationDescription: 'Patented virtual sensor algorithm trained on over 120,000 battery degradation cycles across NMC and LFP chemistries without requiring expensive extra physical sensors inside cell casings.',
    technologies: ['PyTorch', 'CAN Bus', 'Embedded C++', 'EIS Analysis', 'Thermal Dynamics', 'Edge Computing'],
    programmingLanguages: ['Python', 'C++', 'Rust'],
    hardwareUsed: ['Automotive Grade NXP S32K3 Microcontroller', 'TI BQ79616 BMS Chip'],
    aiMlUsed: ['Spatial-Temporal Transformer', 'Electrochemical Surrogate Model'],
    githubRepo: 'https://github.com/afterlife-demo/sentient-cell-bms',
    demoUrl: 'https://sentientcell.demo-afterlife.org',
    stage: 'tested',
    requirements: ['Industry Partner', 'Testing Facility', 'Funding', 'Market Validation'],
    files: [
      {
        name: 'SentientCell_Technical_Whitepaper.pdf',
        type: 'pdf',
        url: 'https://example.com/files/sentientcell-whitepaper.pdf',
        sizeBytes: 8900000,
        uploadedAt: '2026-08-13T14:00:00Z'
      },
      {
        name: 'Battery_Chamber_Explosion_Prevention_Test.mp4',
        type: 'video',
        url: 'https://example.com/files/test-video.mp4',
        sizeBytes: 45000000,
        uploadedAt: '2026-08-13T14:30:00Z'
      }
    ],
    projectDNA: {
      domain: 'Electric Vehicles',
      technologies: ['Edge AI', 'BMS', 'EIS Spectroscopy', 'PyTorch', 'CAN Bus', 'Thermal Dynamics'],
      problem: 'Catastrophic EV lithium battery thermal runaway without advance warning',
      solution: 'Impedance-based early electrochemical dendrite anomaly detection using edge transformer inference on BMS',
      developmentStage: 'tested',
      requiredSkills: ['Automotive Functional Safety (ISO 26262)', 'Battery Pack Chemistry', 'High-Voltage Embedded Design'],
      requiredResources: ['Automotive Tier-1 Validation Lab', 'Thermal Abuse Test Chamber', 'Series Seed Co-investment'],
      potentialUsers: ['EV Automakers (OEMs)', 'Commercial Fleet Operators', 'Energy Storage System Integrators'],
      possibleApplications: ['Passenger electric vehicles', 'Electric bus fleets', 'Grid megawatt battery storage banks'],
      keywords: ['ev', 'battery', 'bms', 'thermal runaway', 'lithium-ion', 'automotive', 'clean energy', 'safety']
    },
    maturityAssessment: {
      currentStage: 'tested',
      numericLevel: 3,
      nextRecommendedStage: 'pilot',
      reason: 'The predictive algorithm has achieved 97.4% accuracy across lab-grade single cell abuse tests. The critical next milestone is an in-vehicle fleet pilot integration with an automotive partner or commercial delivery van fleet.',
      confidenceScore: 92,
      maturityFactors: {
        codeMaturity: 88,
        hardwareValidation: 81,
        userTesting: 69,
        marketReadiness: 64
      },
      disclaimer: 'AI-assisted project maturity assessment based on laboratory validation metrics and automotive compliance logs.'
    },
    needsNext: [
      {
        id: 'need_ev_1',
        type: 'Industry Partner',
        title: 'Automotive OEM or EV Fleet Partner',
        reason: 'Integrate SentientCell edge firmware onto an active test fleet vehicle running real street drive cycles.',
        priority: 'high'
      },
      {
        id: 'need_ev_2',
        type: 'Testing Facility',
        title: 'Certified High-Voltage Battery Abuse Bunker',
        reason: 'Complete UL 9540A and ISO 26262 ASIL-D safety qualification documentation.',
        priority: 'high'
      }
    ],
    isDiscoverable: true,
    createdAt: '2026-08-13T13:20:00Z',
    updatedAt: '2026-09-05T10:15:00Z',
    industryPartnerId: 'user_industry_1',
    industryPartnerName: 'VoltGrid Mobility Corp',
    viewCount: 238
  },
  {
    id: 'proj_agri_drone_3',
    ownerId: 'user_student_3',
    ownerName: 'Kofi Mensah',
    ownerCollege: 'CalPoly State University',
    title: 'AeroCure: Autonomous Multispectral Crop Diagnostic & Micro-Dosing Drone',
    category: 'AgriTech & Robotics',
    domain: 'Agriculture',
    problemStatement: 'Crop fungal pathogens and insect infestations wipe out 20-40% of smallholder harvest yields before farmers visually detect leaf discoloration. Broadcast pesticide spraying wastes 85% of chemical volume and poisons groundwater.',
    proposedSolution: 'AeroCure is a sub-$600 autonomous quadcopter featuring a custom dual NDVI/RGB camera lens. As it flies over field rows, an onboard Jetson Orin Nano pinpoints fungal spots and activates an ultra-precision droplet nozzle that treats ONLY infected leaves, slashing chemical usage by 82%.',
    innovationDescription: 'Sub-centimeter target delivery with real-time wind drift compensation and offline edge vision pipeline capable of detecting early septoria blight 7 days before human eye detection.',
    technologies: ['Computer Vision', 'YOLOv10', 'Drone PX4', 'ROS2', 'Python', 'Edge AI', 'IoT'],
    programmingLanguages: ['Python', 'C++', 'Bash'],
    hardwareUsed: ['Nvidia Jetson Orin Nano', 'PX4 Autopilot', 'Sony IMX477 Sensors', 'Piezo Micro-Nozzles'],
    aiMlUsed: ['YOLOv10 Leaf Disease Detector', 'NDVI Spectral Health Index Classifier'],
    githubRepo: 'https://github.com/afterlife-demo/aerocure-drone-cv',
    demoUrl: 'https://aerocure.demo-afterlife.org',
    stage: 'prototype',
    requirements: ['Testing Facility', 'Industry Partner', 'Funding', 'Market Validation'],
    files: [
      {
        name: 'AeroCure_Field_Yield_Improvement_Study.pdf',
        type: 'pdf',
        url: 'https://example.com/files/aerocure-study.pdf',
        sizeBytes: 6200000,
        uploadedAt: '2026-08-16T10:00:00Z'
      },
      {
        name: 'Drone_Micro_Spray_Demonstration.mp4',
        type: 'video',
        url: 'https://example.com/files/drone-demo.mp4',
        sizeBytes: 38000000,
        uploadedAt: '2026-08-16T10:30:00Z'
      }
    ],
    projectDNA: {
      domain: 'Agriculture',
      technologies: ['Computer Vision', 'Robotics', 'PX4', 'ROS2', 'NDVI', 'Edge AI', 'Jetson'],
      problem: 'Overuse of toxic broadcast pesticides and late detection of devastating agricultural fungal blights',
      solution: 'Autonomous drone with on-device computer vision leaf diagnosis and targeted micro-droplet nozzle treatment',
      developmentStage: 'prototype',
      requiredSkills: ['Drone Flight Regulations (FAA Part 107)', 'Crop Pathology', 'ROS2 Navigation Stack'],
      requiredResources: ['Commercial Vineyard or Corn Acreage for Pilot', 'Agricultural Equipment Distributor Mentor', '$40k Field Testing Grant'],
      potentialUsers: ['Commercial Vineyard Owners', 'Cooperative Farm Alliances', 'Agronomists & Crop Insurers'],
      possibleApplications: ['Precision pesticide reduction', 'Organic farm fungal management', 'High-value orchard yield forecasting'],
      keywords: ['agriculture', 'drone', 'ai', 'computer vision', 'pesticide', 'robotics', 'farming', 'sustainability']
    },
    maturityAssessment: {
      currentStage: 'prototype',
      numericLevel: 2,
      nextRecommendedStage: 'tested',
      reason: 'The drone has completed tethered indoor flight tests with accurate spray nozzle actuation. It now requires multi-acre field tests across varying weather conditions (wind gusts, changing sunlight angles) to validate classification accuracy on live crops.',
      confidenceScore: 86,
      maturityFactors: {
        codeMaturity: 75,
        hardwareValidation: 70,
        userTesting: 40,
        marketReadiness: 35
      },
      disclaimer: 'AI-assisted project maturity assessment based on autonomous flight logs and image classifier F1-scores.'
    },
    needsNext: [
      {
        id: 'need_agri_1',
        type: 'Industry Partner',
        title: 'Commercial Farm Test Bed (100+ Acres)',
        reason: 'Deploy weekly automated flight plans over real infected crop parcels to benchmark yield delta.',
        priority: 'high'
      },
      {
        id: 'need_agri_2',
        type: 'Mentor',
        title: 'Agricultural Robotics Commercialization Expert',
        reason: 'Guide FAA Part 137 agricultural drone dispensing waivers and farmer distribution partnerships.',
        priority: 'medium'
      }
    ],
    isDiscoverable: true,
    createdAt: '2026-08-16T09:40:00Z',
    updatedAt: '2026-09-03T11:00:00Z',
    viewCount: 189
  },
  {
    id: 'proj_neuro_rehab_4',
    ownerId: 'user_student_4',
    ownerName: 'Maya Lin',
    ownerCollege: 'Johns Hopkins University',
    title: 'NeuroSleeve: AI-Guided At-Home Stroke Physical Therapy Sleeve',
    category: 'MedTech & Wearables',
    domain: 'Healthcare',
    problemStatement: 'Over 800,000 stroke survivors each year require intensive occupational therapy to regain motor skills; however, 74% drop out due to travel costs, clinic shortages, and lack of real-time movement feedback between bi-weekly visits.',
    proposedSolution: 'A breathable, washable compression arm sleeve embedded with 9 6-DOF IMU motion trackers and EMG muscle sensors. The companion app gives survivors gamified physical therapy routines with real-time haptic posture correction and sends quantitative joint range-of-motion progress to their neurologist.',
    innovationDescription: 'Proprietary neuromuscular compensatory-movement filter that detects when a patient is "cheating" exercises using shoulder shrugs instead of targeted bicep/tricep recruitment.',
    technologies: ['TensorFlow Lite', 'BLE 5.3', 'IMU Kinematics', 'EMG Signal Processing', 'React Native', 'FastAPI'],
    programmingLanguages: ['Python', 'TypeScript', 'C'],
    hardwareUsed: ['BNO085 9-Axis IMU', 'BioAmp EMG Sensors', 'Nordic nRF5340 Dual-Core BLE'],
    aiMlUsed: ['Kinematic Compensation Classifier', 'Personalized Motor Recovery Curve Predictor'],
    githubRepo: 'https://github.com/afterlife-demo/neurosleeve-stroke-rehab',
    demoUrl: 'https://neurosleeve.demo-afterlife.org',
    stage: 'tested',
    requirements: ['Mentor', 'Testing Facility', 'Research Support', 'Funding'],
    files: [
      {
        name: 'NeuroSleeve_IRB_Pilot_Study_Protocol.pdf',
        type: 'pdf',
        url: 'https://example.com/files/neurosleeve-irb.pdf',
        sizeBytes: 5400000,
        uploadedAt: '2026-08-21T15:00:00Z'
      }
    ],
    projectDNA: {
      domain: 'Healthcare',
      technologies: ['Wearables', 'EMG', 'IMU Kinematics', 'TensorFlow Lite', 'BLE', 'Digital Health'],
      problem: 'Poor stroke rehabilitation compliance and lack of quantitative motor tracking at home',
      solution: 'Smart sensor sleeve with real-time haptic compensatory motion detection and remote clinician progress dashboards',
      developmentStage: 'tested',
      requiredSkills: ['Clinical Study Design', 'Medical Device Regulatory (FDA De Novo / 510k)', 'Textile Electronics'],
      requiredResources: ['Rehabilitation Hospital Clinical Study Access', 'MedTech Regulatory Mentor', '$50k Translation Grant'],
      potentialUsers: ['Post-Stroke Survivors', 'Physical & Occupational Therapists', 'Neurology Departments'],
      possibleApplications: ['Home stroke recovery', 'Parkinsons tremor monitoring', 'Sports orthopedic injury rehabilitation'],
      keywords: ['healthcare', 'medtech', 'wearables', 'rehab', 'stroke', 'physical therapy', 'emg', 'kinematics']
    },
    maturityAssessment: {
      currentStage: 'tested',
      numericLevel: 3,
      nextRecommendedStage: 'pilot',
      reason: 'The hardware has passed benchtop sensor validation and initial usability tests with 12 healthy volunteer subjects. The next milestone requires an institutional IRB-approved 30-patient clinical pilot at an affiliated hospital.',
      confidenceScore: 91,
      maturityFactors: {
        codeMaturity: 85,
        hardwareValidation: 83,
        userTesting: 72,
        marketReadiness: 55
      },
      disclaimer: 'AI-assisted project maturity assessment. Not a substitute for FDA medical device clearance or institutional review board protocol approval.'
    },
    needsNext: [
      {
        id: 'need_health_1',
        type: 'Mentor',
        title: 'MedTech Clinical Trial Advisor',
        reason: 'Formulate IRB submission paperwork and clinical endpoint metrics with hospital partner.',
        priority: 'high'
      },
      {
        id: 'need_health_2',
        type: 'Testing Facility',
        title: 'Hospital Outpatient Physical Therapy Clinic',
        reason: 'Run observational 30-patient pilot during scheduled weekly rehab sessions.',
        priority: 'high'
      }
    ],
    isDiscoverable: true,
    createdAt: '2026-08-21T14:30:00Z',
    updatedAt: '2026-09-04T12:00:00Z',
    mentorId: 'user_mentor_3',
    mentorName: 'Dr. Ananya Roy',
    viewCount: 310
  },
  {
    id: 'proj_smart_traffic_5',
    ownerId: 'user_student_5',
    ownerName: 'David Chen',
    ownerCollege: 'Georgia Institute of Technology',
    title: 'MeshSignal: Decentralized Reinforcement Learning Traffic Intersection Mesh',
    category: 'Smart Cities & AI',
    domain: 'Smart City',
    problemStatement: 'Fixed-timer traffic lights waste billions of commuter hours and create unnecessary vehicular idling emissions. Centralized cloud traffic optimization systems cost millions to install and freeze when fiber cables are severed.',
    proposedSolution: 'MeshSignal turns standard traffic intersection cabinets into collaborative edge AI nodes that communicate over low-latency V2X and sub-GHz mesh. Each intersection runs local multi-agent reinforcement learning (MARL) to green-wave emergency vehicles and eliminate idle red lights.',
    innovationDescription: 'Zero-cloud peer-to-peer game-theoretic coordination protocol that operates flawlessly even with 60% node packet loss or total municipal network isolation.',
    technologies: ['C++', 'Multi-Agent RL', 'SUMO Simulator', 'V2X', 'Edge Computing', 'MQTT', 'Docker'],
    programmingLanguages: ['C++', 'Python'],
    hardwareUsed: ['Advantech Industrial Edge Box', 'DSRC/C-V2X Radio Module'],
    aiMlUsed: ['Multi-Agent Proximal Policy Optimization (MAPPO)', 'Traffic Flow Prediction LSTM'],
    githubRepo: 'https://github.com/afterlife-demo/meshsignal-marl',
    demoUrl: 'https://meshsignal.demo-afterlife.org',
    stage: 'prototype',
    requirements: ['Industry Partner', 'Testing Facility', 'Mentor', 'Funding'],
    files: [
      {
        name: 'MeshSignal_SUMO_Traffic_Simulation_Benchmark.pdf',
        type: 'pdf',
        url: 'https://example.com/files/meshsignal-benchmark.pdf',
        sizeBytes: 9800000,
        uploadedAt: '2026-08-26T16:00:00Z'
      }
    ],
    projectDNA: {
      domain: 'Smart City',
      technologies: ['C++', 'Multi-Agent RL', 'Edge Computing', 'V2X', 'Simulation'],
      problem: 'Fixed-cycle traffic congestion and vulnerability of centralized municipal traffic controllers',
      solution: 'Decentralized peer-to-peer multi-agent reinforcement learning traffic controller mesh for adaptive corridor green-waves',
      developmentStage: 'prototype',
      requiredSkills: ['Traffic Systems Engineering', 'C++ High-Performance Networking', 'Municipal NEMA TS2 Standards'],
      requiredResources: ['Municipal Traffic Test Bed Corridor', 'Department of Transportation Liaison', '$30k Hardware Deployment Grant'],
      potentialUsers: ['City Traffic Operations Centers', 'Emergency First Responders', 'Public Transit Agencies'],
      possibleApplications: ['Corridor congestion relief', 'Fire engine & ambulance priority clearing', 'Autonomous fleet routing'],
      keywords: ['smart city', 'traffic', 'reinforcement learning', 'v2x', 'mesh', 'urban mobility', 'c++']
    },
    maturityAssessment: {
      currentStage: 'prototype',
      numericLevel: 2,
      nextRecommendedStage: 'tested',
      reason: 'The multi-agent RL policy has proven 34% reduction in vehicle wait times across a 25-intersection simulated Manhattan grid in SUMO. Hardware-in-the-loop (HIL) testing with certified traffic controller hardware is needed next.',
      confidenceScore: 88,
      maturityFactors: {
        codeMaturity: 82,
        hardwareValidation: 65,
        userTesting: 50,
        marketReadiness: 42
      },
      disclaimer: 'AI-assisted project maturity assessment based on SUMO micro-simulation logs and C++ algorithmic unit tests.'
    },
    needsNext: [
      {
        id: 'need_city_1',
        type: 'Industry Partner',
        title: 'Municipal Traffic Equipment Vendor',
        reason: 'Provide NEMA TS2 standard cabinet breakout interface harnesses for field testing.',
        priority: 'high'
      },
      {
        id: 'need_city_2',
        type: 'Testing Facility',
        title: 'Closed Smart City Proving Grounds',
        reason: 'Run physical vehicle corridor trials with 4 test vehicles and 3 connected signals.',
        priority: 'high'
      }
    ],
    isDiscoverable: true,
    createdAt: '2026-08-26T15:50:00Z',
    updatedAt: '2026-09-06T14:20:00Z',
    industryPartnerId: 'user_industry_3',
    industryPartnerName: 'CivicMesh Smart Infrastructure',
    viewCount: 174
  }
];

export const DEMO_FUSION_IDEAS: ProjectFusionIdea[] = [
  {
    id: 'fusion_flood_traffic',
    title: 'Autonomous Flood Evacuation & Resilient Route Green-Wave Grid',
    combinedSolutionName: 'HydroRoute: AI Flood Predictive Evacuation Mesh',
    summary: 'When river sensors detect sudden flash flooding, the system automatically communicates with municipal traffic mesh controllers to green-wave evacuation corridors and trigger dynamic LED route diversions before roads become submerged.',
    projectIds: ['proj_flood_1', 'proj_smart_traffic_5'],
    projectTitles: [
      'Smart Flood Monitoring & Early Warning Mesh',
      'MeshSignal: Decentralized Reinforcement Learning Traffic Intersection Mesh'
    ],
    complementaryReasons: [
      'Flood sensors provide real-time hydraulic inundation data but lack a direct physical mechanism to redirect fleeing vehicular traffic.',
      'Mesh traffic signals can control street corridors in real time but currently have zero environmental hazard awareness.',
      'Together, they form a self-healing civil defense network that operates even when cellular towers fail.'
    ],
    combinedArchitecture: [
      {
        layerName: 'Sensor Layer (Smart Flood)',
        contributedBy: 'Aarav Sharma (MIT)',
        description: 'LoRaWAN acoustic & radar river gauges detect rising water surges and forecast roadway flooding 25 minutes in advance.'
      },
      {
        layerName: 'Coordination Protocol',
        contributedBy: 'Joint Integration Bridge',
        description: 'Direct sub-GHz radio beacon transmits localized flood vector coordinates directly to nearby traffic cabinet receivers.'
      },
      {
        layerName: 'Actuation & Routing (MeshSignal)',
        contributedBy: 'David Chen (Georgia Tech)',
        description: 'Intersections dynamically modify signal timings to flush evacuation avenues away from the flood boundary.'
      }
    ],
    synergyScore: 94,
    status: 'suggested'
  },
  {
    id: 'fusion_ev_agri',
    title: 'Off-Grid Smart Farm Agrivoltaic Energy & Autonomous Drone Fleet Hub',
    combinedSolutionName: 'VoltFarm: Renewable Agrivoltaic Drone Fleet & Battery Life Extender',
    summary: 'Combine mobile agricultural drones with adaptive second-life EV battery energy storage on farms to enable 24/7 continuous autonomous field disease treatment with zero grid dependency.',
    projectIds: ['proj_ev_battery_2', 'proj_agri_drone_3'],
    projectTitles: [
      'SentientCell: Predictive EV Battery Thermal Runaway AI',
      'AeroCure: Autonomous Multispectral Crop Diagnostic & Micro-Dosing Drone'
    ],
    complementaryReasons: [
      'Precision drones need high-current field battery fast-charging that severely degrades standard lithium battery packs.',
      'SentientCell provides electrochemical health and safe fast-charging control, allowing agricultural drones to recharge safely in remote fields.',
      'Enables continuous farm monitoring without fire risk in dry agricultural climates.'
    ],
    combinedArchitecture: [
      {
        layerName: 'Field Energy Storage (SentientCell)',
        contributedBy: 'Elena Rostova (Stanford)',
        description: 'Containerized second-life EV battery bank monitors cell degradation and optimizes rapid field DC charging.'
      },
      {
        layerName: 'Autonomous Crop Protection (AeroCure)',
        contributedBy: 'Kofi Mensah (CalPoly)',
        description: 'Drones land automatically on inductive charging pads and receive pinpoint mission flight paths.'
      }
    ],
    synergyScore: 88,
    status: 'suggested'
  }
];

export const DEMO_COLLABORATIONS: CollaborationRecord[] = [
  {
    id: 'collab_1',
    projectAId: 'proj_flood_1',
    projectATitle: 'Smart Flood Monitoring & Early Warning Mesh',
    projectBId: 'proj_smart_traffic_5',
    projectBTitle: 'MeshSignal: Decentralized Reinforcement Learning Traffic Intersection Mesh',
    senderId: 'user_student_1',
    senderName: 'Aarav Sharma',
    receiverId: 'user_student_5',
    receiverName: 'David Chen',
    fusionConceptTitle: 'HydroRoute: AI Flood Predictive Evacuation Mesh',
    message: 'Hey David! I saw your MeshSignal project. During flash floods, people get trapped at traffic lights on flooded roads. If we connect my LoRa water sensors to your signal mesh over sub-GHz radio, we could automatically route cars away from flooded underpasses. Want to team up?',
    status: 'accepted',
    createdAt: '2026-09-08T10:00:00Z',
    updatedAt: '2026-09-09T14:30:00Z'
  },
  {
    id: 'collab_2',
    projectAId: 'proj_ev_battery_2',
    projectATitle: 'SentientCell: Predictive EV Battery Thermal Runaway AI',
    projectBId: 'proj_agri_drone_3',
    projectBTitle: 'AeroCure: Autonomous Multispectral Crop Diagnostic Drone',
    senderId: 'user_student_2',
    senderName: 'Elena Rostova',
    receiverId: 'user_student_3',
    receiverName: 'Kofi Mensah',
    fusionConceptTitle: 'VoltFarm: Renewable Agrivoltaic Drone Fleet & Battery Life Extender',
    message: 'Hi Kofi! Your drone platform is incredible. We are working on specialized high-rate battery cooling and health tracking. We could co-develop a weatherproof field recharging dock for your drones.',
    status: 'pending',
    createdAt: '2026-09-12T09:15:00Z',
    updatedAt: '2026-09-12T09:15:00Z'
  }
];

export const DEMO_MILESTONES: Milestone[] = [
  // Milestones for Flood Monitoring
  {
    id: 'ms_flood_1',
    projectId: 'proj_flood_1',
    title: 'Benchtop Hydro-Radar Sensor Calibration',
    description: 'Calibrate Doppler 24GHz radar velocity measurements against standard laboratory laser velocimetry.',
    status: 'COMPLETED',
    deadline: '2026-08-20',
    responsiblePerson: 'Aarav Sharma',
    notes: 'Completed in MIT lab with 1.8% margin of error.',
    completionDate: '2026-08-19',
    order: 1
  },
  {
    id: 'ms_flood_2',
    projectId: 'proj_flood_1',
    title: 'Controlled Wave & Flume Tank Testing',
    description: 'Stress test waterproof IP68 enclosure in NRTC simulated turbulent water channel.',
    status: 'IN PROGRESS',
    deadline: '2026-10-15',
    responsiblePerson: 'Dr. Sarah Jenkins & Aarav',
    notes: 'Access scheduled at NRTC testing grounds for early October.',
    order: 2
  },
  {
    id: 'ms_flood_3',
    projectId: 'proj_flood_1',
    title: 'FEMA CAP Alert Protocol Software Integration',
    description: 'Format output payloads into OASIS Common Alerting Protocol v1.2 XML/JSON specifications.',
    status: 'NOT STARTED',
    deadline: '2026-11-10',
    responsiblePerson: 'Aarav Sharma',
    notes: 'Requirements received from emergency management partner.',
    order: 3
  },
  {
    id: 'ms_flood_4',
    projectId: 'proj_flood_1',
    title: 'Municipal Riverside Pilot Deployment (10 Nodes)',
    description: 'Install 10 solar LoRa nodes along Charles River basin in collaboration with state watershed authority.',
    status: 'NOT STARTED',
    deadline: '2026-12-05',
    responsiblePerson: 'Joint Pilot Team',
    notes: 'Contingent on flume tank certification.',
    order: 4
  },
  // Milestones for EV Battery
  {
    id: 'ms_ev_1',
    projectId: 'proj_ev_battery_2',
    title: 'Single-Cell Thermal Abuse Validation',
    description: 'Trigger localized nail penetration and thermal runaway in climate-controlled test bunker.',
    status: 'COMPLETED',
    deadline: '2026-08-25',
    responsiblePerson: 'Elena Rostova',
    notes: 'Model successfully predicted thermal runaway 42 minutes before venting.',
    completionDate: '2026-08-24',
    order: 1
  },
  {
    id: 'ms_ev_2',
    projectId: 'proj_ev_battery_2',
    title: 'Automotive CAN Bus Hardware-in-the-Loop Setup',
    description: 'Integrate edge inference code onto automotive-grade S32K3 microcontroller board.',
    status: 'IN PROGRESS',
    deadline: '2026-10-01',
    responsiblePerson: 'Marcus Vance & Elena',
    notes: 'Firmware latency currently at 4.2ms, well within the 10ms safety window.',
    order: 2
  },
  {
    id: 'ms_ev_3',
    projectId: 'proj_ev_battery_2',
    title: 'VoltGrid Fleet Vehicle On-Road Trial',
    description: 'Deploy firmware to 5 VoltGrid commercial test vans running urban stop-and-go routes.',
    status: 'NOT STARTED',
    deadline: '2026-11-20',
    responsiblePerson: 'VoltGrid Engineering Team',
    order: 3
  }
];

export const DEMO_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_student_1',
    title: 'Mentor Connection Accepted',
    message: 'Dr. Sarah Jenkins accepted your mentorship request for "Smart Flood Monitoring".',
    type: 'mentor_acceptance',
    timestamp: '2026-09-02T16:15:00Z',
    read: false,
    actionLink: 'project'
  },
  {
    id: 'notif_2',
    userId: 'user_student_1',
    title: 'New Project Fusion Match Discovered',
    message: 'AI found a high-synergy match (94%) with "MeshSignal: Traffic Intersection Mesh" by David Chen.',
    type: 'new_recommendation',
    timestamp: '2026-09-07T11:20:00Z',
    read: false,
    actionLink: 'fusion'
  },
  {
    id: 'notif_3',
    userId: 'user_student_1',
    title: 'Collaboration Accepted!',
    message: 'David Chen accepted your collaboration proposal on "HydroRoute: Flood Evacuation Mesh".',
    type: 'collaboration_acceptance',
    timestamp: '2026-09-09T14:35:00Z',
    read: true,
    actionLink: 'collaborations'
  },
  {
    id: 'notif_4',
    userId: 'user_student_2',
    title: 'Industry Partner Interest',
    message: 'VoltGrid Mobility Corp reviewed your SentientCell technical whitepaper.',
    type: 'new_recommendation',
    timestamp: '2026-09-05T09:00:00Z',
    read: true,
    actionLink: 'project'
  }
];

export const DEMO_ECOSYSTEM_STATS: EcosystemStats = {
  totalStudents: 148,
  totalProjects: 72,
  activeProjects: 58,
  mentorConnections: 43,
  industryConnections: 29,
  collaborationRequests: 36,
  projectsInPilot: 14,
  projectsDeployed: 8,
  domainBreakdown: [
    { domain: 'Disaster Management', count: 16 },
    { domain: 'Electric Vehicles', count: 14 },
    { domain: 'Healthcare', count: 18 },
    { domain: 'Agriculture', count: 12 },
    { domain: 'Smart City', count: 12 }
  ],
  stageBreakdown: [
    { stage: 'idea', count: 9 },
    { stage: 'prototype', count: 32 },
    { stage: 'tested', count: 17 },
    { stage: 'pilot', count: 10 },
    { stage: 'deployment', count: 4 }
  ],
  techBreakdown: [
    { tech: 'IoT / Sensors', count: 34 },
    { tech: 'Edge AI / TinyML', count: 28 },
    { tech: 'C++ Systems', count: 24 },
    { tech: 'Computer Vision', count: 21 },
    { tech: 'Robotics', count: 16 },
    { tech: 'CleanTech', count: 15 }
  ]
};
