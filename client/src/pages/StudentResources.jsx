import { useState } from "react";
import { FaGithub, FaGoogle, FaYoutube, FaBook, FaRocket, FaCode, FaBriefcase, FaUsers, FaExternalLinkAlt, FaCube, FaMobile, FaServer, FaLightbulb, FaGraduationCap, FaChevronDown, FaChevronRight, FaDatabase, FaShieldAlt, FaGamepad, FaCloud, FaBrain, FaTerminal, FaLayerGroup } from "react-icons/fa";
import { HiSparkles, HiAcademicCap } from "react-icons/hi";
import { BiData } from "react-icons/bi";

const LinkCard = ({ href, icon: Icon, title, subtitle, color = "from-gray-700 to-gray-900" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${color} text-white hover:scale-[1.02] hover:shadow-lg transition-all duration-200`}
  >
    <div className="p-2 bg-white/20 rounded-lg">
      <Icon className="text-lg" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{title}</p>
      {subtitle && <p className="text-xs opacity-70 truncate">{subtitle}</p>}
    </div>
    <FaExternalLinkAlt className="text-xs opacity-50 group-hover:opacity-100 transition-opacity" />
  </a>
);

const SectionCard = ({ title, icon: Icon, children, gradient = "from-slate-800 to-slate-900" }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-xl`}>
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
      <Icon /> {title}
    </h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

// Tree Node Component
const TreeNode = ({ label, children, isOpen, onToggle, level = 0, color = "text-white" }) => {
  const hasChildren = children && children.length > 0;
  const indent = level * 16;
  
  return (
    <div>
      <div 
        className={`flex items-center gap-2 py-1 cursor-pointer hover:bg-white/10 rounded px-2 -mx-2 ${color}`}
        style={{ paddingLeft: indent }}
        onClick={onToggle}
      >
        {hasChildren ? (
          isOpen ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />
        ) : (
          <span className="w-3 h-3 rounded-full bg-current opacity-40" />
        )}
        <span className={`text-sm ${level === 0 ? 'font-bold' : level === 1 ? 'font-medium' : 'font-normal opacity-90'}`}>
          {label}
        </span>
      </div>
      {isOpen && hasChildren && (
        <div className="ml-2 border-l border-white/20 pl-2">
          {children}
        </div>
      )}
    </div>
  );
};

// Tech Stack Tree Component
const TechStackTree = ({ title, icon: Icon, data, gradient }) => {
  const [openNodes, setOpenNodes] = useState(new Set(['root']));
  
  const toggleNode = (nodeId) => {
    setOpenNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderTree = (nodes, parentId = '', level = 0) => {
    return nodes.map((node, idx) => {
      const nodeId = `${parentId}-${idx}`;
      const isOpen = openNodes.has(nodeId) || level === 0;
      
      return (
        <TreeNode
          key={nodeId}
          label={node.name}
          isOpen={isOpen}
          onToggle={() => toggleNode(nodeId)}
          level={level}
        >
          {node.children && renderTree(node.children, nodeId, level + 1)}
        </TreeNode>
      );
    });
  };

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-xl`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Icon /> {title}
      </h3>
      <div className="space-y-1 text-sm">
        {renderTree(data)}
      </div>
    </div>
  );
};

// Tech Stack Data
const techStacks = {
  webFrontend: [
    { name: "Languages", children: [
      { name: "HTML5" },
      { name: "CSS3 / SCSS / Sass" },
      { name: "JavaScript (ES6+)" },
      { name: "TypeScript" }
    ]},
    { name: "React", children: [
      { name: "Next.js" },
      { name: "Gatsby" },
      { name: "Remix" },
      { name: "React Router" },
      { name: "Redux / Zustand" }
    ]},
    { name: "Vue.js", children: [
      { name: "Nuxt.js" },
      { name: "Vuetify" },
      { name: "Pinia" },
      { name: "Vue Router" }
    ]},
    { name: "Other Frameworks", children: [
      { name: "Angular" },
      { name: "Svelte / SvelteKit" },
      { name: "Solid.js" },
      { name: "Qwik" }
    ]},
    { name: "Styling", children: [
      { name: "Tailwind CSS" },
      { name: "Bootstrap" },
      { name: "Material UI" },
      { name: "Styled Components" }
    ]},
    { name: "Build Tools", children: [
      { name: "Vite" },
      { name: "Webpack" },
      { name: "esbuild" },
      { name: "Parcel" }
    ]}
  ],
  webBackend: [
    { name: "Languages", children: [
      { name: "JavaScript / Node.js" },
      { name: "Python" },
      { name: "Java" },
      { name: "Go" },
      { name: "Rust" },
      { name: "C# / .NET" },
      { name: "PHP" },
      { name: "Ruby" }
    ]},
    { name: "Frameworks", children: [
      { name: "Node.js", children: [
        { name: "Express.js" },
        { name: "Fastify" },
        { name: "NestJS" },
        { name: "Koa" }
      ]},
      { name: "Python", children: [
        { name: "Django" },
        { name: "Flask" },
        { name: "FastAPI" }
      ]},
      { name: "Java", children: [
        { name: "Spring Boot" },
        { name: "Quarkus" }
      ]},
      { name: "Go", children: [
        { name: "Gin" },
        { name: "Echo" },
        { name: "Fiber" }
      ]}
    ]},
    { name: "APIs", children: [
      { name: "REST" },
      { name: "GraphQL" },
      { name: "gRPC" },
      { name: "WebSockets" }
    ]}
  ],
  databases: [
    { name: "Relational (SQL)", children: [
      { name: "PostgreSQL" },
      { name: "MySQL / MariaDB" },
      { name: "SQLite" },
      { name: "Microsoft SQL Server" }
    ]},
    { name: "NoSQL", children: [
      { name: "MongoDB" },
      { name: "Redis" },
      { name: "Cassandra" },
      { name: "DynamoDB" }
    ]},
    { name: "ORMs", children: [
      { name: "Prisma" },
      { name: "Sequelize" },
      { name: "TypeORM" },
      { name: "SQLAlchemy" },
      { name: "Hibernate" }
    ]},
    { name: "Vector DBs (AI)", children: [
      { name: "Pinecone" },
      { name: "Weaviate" },
      { name: "Milvus" },
      { name: "ChromaDB" }
    ]}
  ],
  mobile: [
    { name: "Native iOS", children: [
      { name: "Swift" },
      { name: "SwiftUI" },
      { name: "UIKit" },
      { name: "Xcode" }
    ]},
    { name: "Native Android", children: [
      { name: "Kotlin" },
      { name: "Jetpack Compose" },
      { name: "Android Studio" }
    ]},
    { name: "Cross-Platform", children: [
      { name: "React Native" },
      { name: "Flutter (Dart)" },
      { name: "Ionic" },
      { name: "Xamarin" }
    ]}
  ],
  dataScience: [
    { name: "Languages", children: [
      { name: "Python" },
      { name: "R" },
      { name: "Julia" },
      { name: "SQL" }
    ]},
    { name: "Data Analysis", children: [
      { name: "Pandas" },
      { name: "NumPy" },
      { name: "SciPy" },
      { name: "Polars" }
    ]},
    { name: "Visualization", children: [
      { name: "Matplotlib" },
      { name: "Seaborn" },
      { name: "Plotly" },
      { name: "D3.js" }
    ]},
    { name: "ML Frameworks", children: [
      { name: "scikit-learn" },
      { name: "TensorFlow" },
      { name: "PyTorch" },
      { name: "Keras" },
      { name: "XGBoost" }
    ]},
    { name: "Tools", children: [
      { name: "Jupyter Notebooks" },
      { name: "Google Colab" },
      { name: "Anaconda" },
      { name: "MLflow" }
    ]}
  ],
  ai: [
    { name: "LLMs & APIs", children: [
      { name: "OpenAI API" },
      { name: "Anthropic Claude" },
      { name: "Google Gemini" },
      { name: "Hugging Face" }
    ]},
    { name: "Frameworks", children: [
      { name: "LangChain" },
      { name: "LlamaIndex" },
      { name: "Semantic Kernel" },
      { name: "AutoGen" }
    ]},
    { name: "Local Models", children: [
      { name: "Ollama" },
      { name: "LM Studio" },
      { name: "llama.cpp" }
    ]},
    { name: "Computer Vision", children: [
      { name: "OpenCV" },
      { name: "YOLO" },
      { name: "MediaPipe" }
    ]}
  ],
  devops: [
    { name: "Containers", children: [
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "Podman" }
    ]},
    { name: "CI/CD", children: [
      { name: "GitHub Actions" },
      { name: "GitLab CI" },
      { name: "Jenkins" },
      { name: "CircleCI" }
    ]},
    { name: "Cloud Providers", children: [
      { name: "AWS", children: [
        { name: "EC2, S3, Lambda" },
        { name: "RDS, DynamoDB" }
      ]},
      { name: "Google Cloud", children: [
        { name: "Compute, Storage" },
        { name: "Cloud Run, Functions" }
      ]},
      { name: "Azure" },
      { name: "DigitalOcean" },
      { name: "Vercel / Netlify" }
    ]},
    { name: "Infrastructure", children: [
      { name: "Terraform" },
      { name: "Ansible" },
      { name: "Pulumi" }
    ]}
  ],
  security: [
    { name: "Tools", children: [
      { name: "Wireshark" },
      { name: "Burp Suite" },
      { name: "Metasploit" },
      { name: "Nmap" },
      { name: "John the Ripper" }
    ]},
    { name: "Platforms", children: [
      { name: "Hack The Box" },
      { name: "TryHackMe" },
      { name: "OverTheWire" },
      { name: "PicoCTF" }
    ]},
    { name: "Concepts", children: [
      { name: "OWASP Top 10" },
      { name: "Cryptography" },
      { name: "Network Security" },
      { name: "Penetration Testing" }
    ]}
  ],
  systems: [
    { name: "Languages", children: [
      { name: "C" },
      { name: "C++" },
      { name: "Rust" },
      { name: "Assembly" },
      { name: "Zig" }
    ]},
    { name: "OS Concepts", children: [
      { name: "Linux Kernel" },
      { name: "Process Management" },
      { name: "Memory Management" },
      { name: "File Systems" }
    ]},
    { name: "Tools", children: [
      { name: "GDB" },
      { name: "Valgrind" },
      { name: "strace / ltrace" },
      { name: "Make / CMake" }
    ]}
  ],
  gamedev: [
    { name: "Engines", children: [
      { name: "Unity (C#)" },
      { name: "Unreal Engine (C++)" },
      { name: "Godot (GDScript)" },
      { name: "Bevy (Rust)" }
    ]},
    { name: "Graphics", children: [
      { name: "OpenGL" },
      { name: "Vulkan" },
      { name: "DirectX" },
      { name: "WebGL / Three.js" }
    ]},
    { name: "Tools", children: [
      { name: "Blender (3D)" },
      { name: "Aseprite (Pixel Art)" },
      { name: "FMOD / Wwise (Audio)" }
    ]}
  ]
};

export default function StudentResources() {
  const [activeTab, setActiveTab] = useState('essentials');

  const tabs = [
    { id: 'essentials', label: 'Essentials', icon: HiSparkles },
    { id: 'stacks', label: 'Tech Stacks', icon: FaLayerGroup },
    { id: 'learning', label: 'Learning', icon: FaBook },
    { id: 'creative', label: 'Creative Dev', icon: FaCube },
    { id: 'career', label: 'Career', icon: FaBriefcase },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <FaRocket className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Student Resources
            </span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Free tools, learning resources, and career opportunities for CS students
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Essentials Tab */}
        {activeTab === 'essentials' && (
          <div className="space-y-6">
            {/* Hero Cards - Must Have */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GitHub Student Pack */}
              <a
                href="https://education.github.com/pack"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white hover:scale-[1.01] transition-transform"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
                <FaGithub className="text-4xl mb-3" />
                <h2 className="text-xl font-bold mb-1">GitHub Student Developer Pack</h2>
                <p className="text-sm text-gray-300 mb-3">Free access to 100+ dev tools, cloud credits, domains & more</p>
                <span className="inline-flex items-center gap-1 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                  FREE while student
                </span>
              </a>

              {/* Google Student */}
              <a
                href="https://one.google.com/ai-student"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-6 text-white hover:scale-[1.01] transition-transform"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl" />
                <FaGoogle className="text-4xl mb-3" />
                <h2 className="text-xl font-bold mb-1">Google One AI Student</h2>
                <p className="text-sm text-white/80 mb-3">2TB storage, Gemini Advanced, Google tools & ML VMs</p>
                <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                  FREE 1 year
                </span>
              </a>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SectionCard title="Google Tools" icon={FaGoogle} gradient="from-blue-600 to-cyan-600">
                <LinkCard href="https://colab.research.google.com/" icon={BiData} title="Google Colab" subtitle="Free GPU/TPU notebooks" color="from-yellow-500 to-orange-500" />
                <LinkCard href="https://one.google.com/ai-student" icon={HiSparkles} title="Gemini Advanced" subtitle="Google's best AI" color="from-purple-500 to-pink-500" />
                <LinkCard href="https://cloud.google.com/edu" icon={FaServer} title="Google Cloud" subtitle="$300 credits for students" color="from-red-500 to-orange-500" />
              </SectionCard>

              <SectionCard title="GitHub Perks" icon={FaGithub} gradient="from-gray-800 to-gray-900">
                <LinkCard href="https://github.com/education/students" icon={FaGraduationCap} title="Student Benefits" subtitle="Verify your status" color="from-gray-600 to-gray-800" />
                <LinkCard href="https://github.com/features/copilot" icon={FaCode} title="GitHub Copilot" subtitle="AI pair programmer" color="from-violet-600 to-purple-700" />
                <LinkCard href="https://www.digitalocean.com/github-students" icon={FaServer} title="DigitalOcean" subtitle="$200 cloud credits" color="from-blue-500 to-blue-700" />
              </SectionCard>

              <SectionCard title="Essential Tools" icon={FaRocket} gradient="from-violet-600 to-purple-700">
                <LinkCard href="https://code.visualstudio.com/" icon={FaCode} title="VS Code" subtitle="Microsoft code editor" color="from-slate-700 to-slate-900" />
                <LinkCard href="https://education.github.com/pack" icon={FaGithub} title="JetBrains" subtitle="All IDEs free" color="from-orange-500 to-red-600" />
                <LinkCard href="https://www.eclipse.org/downloads/" icon={FaCode} title="Eclipse IDE" subtitle="Java development" color="from-purple-600 to-indigo-700" />
                <LinkCard href="https://azure.microsoft.com/free/students" icon={FaServer} title="Azure for Students" subtitle="$100 credits" color="from-blue-400 to-blue-600" />
              </SectionCard>
            </div>
          </div>
        )}

        {/* Tech Stacks Tab */}
        {activeTab === 'stacks' && (
          <div className="space-y-6">
            <p className="text-center text-gray-500 text-sm mb-4">
              Click to expand each section. Comprehensive reference of languages, frameworks, and tools.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TechStackTree 
                title="Web Frontend" 
                icon={FaCode} 
                data={techStacks.webFrontend}
                gradient="from-cyan-600 to-blue-700"
              />
              <TechStackTree 
                title="Web Backend" 
                icon={FaServer} 
                data={techStacks.webBackend}
                gradient="from-green-600 to-emerald-700"
              />
              <TechStackTree 
                title="Databases" 
                icon={FaDatabase} 
                data={techStacks.databases}
                gradient="from-amber-600 to-orange-700"
              />
              <TechStackTree 
                title="Mobile Dev" 
                icon={FaMobile} 
                data={techStacks.mobile}
                gradient="from-pink-600 to-rose-700"
              />
              <TechStackTree 
                title="Data Science" 
                icon={BiData} 
                data={techStacks.dataScience}
                gradient="from-purple-600 to-violet-700"
              />
              <TechStackTree 
                title="AI / ML / LLMs" 
                icon={FaBrain} 
                data={techStacks.ai}
                gradient="from-indigo-600 to-purple-700"
              />
              <TechStackTree 
                title="DevOps & Cloud" 
                icon={FaCloud} 
                data={techStacks.devops}
                gradient="from-blue-700 to-indigo-800"
              />
              <TechStackTree 
                title="Cybersecurity" 
                icon={FaShieldAlt} 
                data={techStacks.security}
                gradient="from-red-600 to-rose-700"
              />
              <TechStackTree 
                title="Systems Programming" 
                icon={FaTerminal} 
                data={techStacks.systems}
                gradient="from-slate-700 to-gray-800"
              />
              <TechStackTree 
                title="Game Development" 
                icon={FaGamepad} 
                data={techStacks.gamedev}
                gradient="from-violet-600 to-purple-800"
              />
            </div>
          </div>
        )}

        {/* Learning Tab */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            {/* Algorithms & DS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://www.hello-algo.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white hover:scale-[1.01] transition-transform"
              >
                <FaBook className="text-4xl mb-3" />
                <h2 className="text-xl font-bold mb-1">Hello Algo</h2>
                <p className="text-sm text-white/80">Interactive data structures & algorithms book with visualizations</p>
              </a>

              <a
                href="https://docs.google.com/spreadsheets/d/1K3dIR_iu_jCB-bWrkhog1kTDiIBXCLrwm0CONlUOVgg/edit#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white hover:scale-[1.01] transition-transform"
              >
                <HiAcademicCap className="text-4xl mb-3" />
                <h2 className="text-xl font-bold mb-1">Eleet Coders Master Guide</h2>
                <p className="text-sm text-white/80">Resume templates, interview prep, internship links & more</p>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SectionCard title="DSA & Interview Prep" icon={BiData} gradient="from-green-600 to-emerald-700">
                <LinkCard href="https://leetcode.com/" icon={FaCode} title="LeetCode" subtitle="Practice problems" color="from-yellow-500 to-orange-500" />
                <LinkCard href="https://neetcode.io/" icon={FaCode} title="NeetCode" subtitle="Curated roadmap" color="from-purple-500 to-violet-600" />
                <LinkCard href="https://visualgo.net/" icon={FaCube} title="VisuAlgo" subtitle="Algorithm visualizer" color="from-blue-500 to-cyan-600" />
                <LinkCard href="https://www.bigocheatsheet.com/" icon={FaBook} title="Big-O Cheat Sheet" subtitle="Complexity reference" color="from-red-500 to-pink-600" />
              </SectionCard>

              <SectionCard title="YouTube Channels" icon={FaYoutube} gradient="from-red-600 to-red-700">
                <LinkCard href="https://www.youtube.com/@Fireship" icon={FaYoutube} title="Fireship" subtitle="Fast-paced tutorials" color="from-orange-500 to-red-500" />
                <LinkCard href="https://www.youtube.com/@t3dotgg" icon={FaYoutube} title="Theo - t3.gg" subtitle="Web dev & opinions" color="from-purple-500 to-pink-500" />
                <LinkCard href="https://www.youtube.com/@awesome-coding" icon={FaYoutube} title="Awesome Coding" subtitle="Creative coding" color="from-cyan-500 to-blue-500" />
                <LinkCard href="https://www.youtube.com/@FrontendMasters" icon={FaYoutube} title="Frontend Masters" subtitle="In-depth courses" color="from-red-600 to-red-700" />
              </SectionCard>

              <SectionCard title="Documentation" icon={FaBook} gradient="from-slate-700 to-slate-800">
                <LinkCard href="https://developer.mozilla.org/" icon={FaCode} title="MDN Web Docs" subtitle="Web reference" color="from-blue-600 to-indigo-700" />
                <LinkCard href="https://devdocs.io/" icon={FaBook} title="DevDocs" subtitle="Unified API docs" color="from-gray-600 to-gray-800" />
                <LinkCard href="https://learnxinyminutes.com/" icon={FaRocket} title="Learn X in Y Minutes" subtitle="Quick syntax guides" color="from-green-500 to-teal-600" />
              </SectionCard>
            </div>
          </div>
        )}

        {/* Creative Dev Tab */}
        {activeTab === 'creative' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SectionCard title="3D / WebGL" icon={FaCube} gradient="from-black to-gray-800">
                <LinkCard href="https://threejs.org/docs/" icon={FaCube} title="Three.js Docs" subtitle="3D library" color="from-gray-700 to-black" />
                <LinkCard href="https://threejs.org/examples/" icon={FaCube} title="Three.js Examples" subtitle="Interactive demos" color="from-purple-600 to-violet-700" />
                <LinkCard href="https://r3f.docs.pmnd.rs/" icon={FaCode} title="React Three Fiber" subtitle="React renderer" color="from-cyan-500 to-blue-600" />
                <LinkCard href="https://drei.docs.pmnd.rs/" icon={FaCube} title="Drei Helpers" subtitle="Useful abstractions" color="from-pink-500 to-rose-600" />
              </SectionCard>

              <SectionCard title="WebAssembly" icon={FaCode} gradient="from-purple-700 to-violet-800">
                <LinkCard href="https://webassembly.org/" icon={FaCode} title="WebAssembly.org" subtitle="Official site" color="from-violet-600 to-purple-700" />
                <LinkCard href="https://rustwasm.github.io/wasm-pack/" icon={FaCode} title="wasm-pack" subtitle="Rust to WASM" color="from-orange-600 to-red-700" />
                <LinkCard href="https://emscripten.org/docs/" icon={FaCode} title="Emscripten" subtitle="C/C++ to WASM" color="from-yellow-500 to-orange-600" />
                <LinkCard href="https://github.com/aspect-build/aspect-cli" icon={FaCube} title="ffmpeg.wasm" subtitle="Video processing" color="from-green-600 to-teal-700" />
              </SectionCard>

              <SectionCard title="Frameworks" icon={FaCode} gradient="from-gray-900 to-black">
                <LinkCard href="https://nextjs.org/docs" icon={FaCode} title="Next.js" subtitle="React framework" color="from-gray-800 to-black" />
                <LinkCard href="https://nuxt.com/" icon={FaCode} title="Nuxt" subtitle="Vue framework" color="from-green-500 to-teal-600" />
                <LinkCard href="https://svelte.dev/tutorial" icon={FaCode} title="Svelte" subtitle="Compiler framework" color="from-orange-500 to-red-600" />
                <LinkCard href="https://motion.dev/" icon={FaLightbulb} title="Motion" subtitle="Animation library" color="from-purple-500 to-pink-600" />
              </SectionCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SectionCard title="Creative Coding" icon={FaLightbulb} gradient="from-pink-500 to-purple-600">
                <LinkCard href="https://p5js.org/" icon={FaCode} title="p5.js" subtitle="Creative coding library" color="from-pink-500 to-rose-600" />
                <LinkCard href="https://p5js.org/reference/" icon={FaBook} title="p5.js Reference" subtitle="Full documentation" color="from-purple-500 to-violet-600" />
                <LinkCard href="https://processing.org/" icon={FaCode} title="Processing" subtitle="Visual arts language" color="from-blue-500 to-indigo-600" />
                <LinkCard href="https://processing.org/reference/" icon={FaBook} title="Processing Docs" subtitle="Java-based creative" color="from-cyan-500 to-blue-600" />
                <LinkCard href="https://openprocessing.org/" icon={FaCube} title="OpenProcessing" subtitle="Share & discover" color="from-green-500 to-teal-600" />
              </SectionCard>

              <SectionCard title="Mobile Development" icon={FaMobile} gradient="from-blue-600 to-indigo-700">
                <LinkCard href="https://developer.apple.com/tutorials/develop-in-swift/" icon={FaMobile} title="Swift Tutorials" subtitle="iOS development" color="from-orange-500 to-red-600" />
                <LinkCard href="https://reactnative.dev/docs/getting-started" icon={FaCode} title="React Native" subtitle="Cross-platform" color="from-cyan-500 to-blue-600" />
                <LinkCard href="https://docs.flutter.dev/" icon={FaMobile} title="Flutter" subtitle="Google's UI toolkit" color="from-blue-400 to-cyan-500" />
              </SectionCard>

              <SectionCard title="Inspiration" icon={FaLightbulb} gradient="from-pink-600 to-rose-700">
                <LinkCard href="https://experiments.withgoogle.com/" icon={FaGoogle} title="Google Experiments" subtitle="Creative tech" color="from-blue-500 to-purple-600" />
                <LinkCard href="https://a-way-to-go.com/" icon={FaCube} title="A Way to Go" subtitle="Interactive experience" color="from-green-500 to-teal-600" />
                <LinkCard href="https://nodegarden.js.org/" icon={FaCode} title="Node Garden" subtitle="Generative art" color="from-violet-500 to-purple-600" />
                <LinkCard href="https://antigravity.google/" icon={HiSparkles} title="Google Antigravity" subtitle="AI creativity" color="from-yellow-500 to-orange-600" />
              </SectionCard>
            </div>
          </div>
        )}

        {/* Career Tab */}
        {activeTab === 'career' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SectionCard title="Internships" icon={FaBriefcase} gradient="from-blue-700 to-indigo-800">
                <LinkCard href="https://github.com/pittcsc/Summer2025-Internships" icon={FaGithub} title="Summer 2025 Internships" subtitle="GitHub repo" color="from-gray-700 to-gray-900" />
                <LinkCard href="https://www.freshswe.com/" icon={FaRocket} title="FreshSWE" subtitle="Entry-level roles" color="from-green-500 to-teal-600" />
                <LinkCard href="https://app.joinhandshake.com/" icon={FaBriefcase} title="Handshake" subtitle="Campus recruiting" color="from-orange-500 to-red-600" />
                <LinkCard href="https://www.dice.com/" icon={FaBriefcase} title="Dice" subtitle="Tech jobs" color="from-red-500 to-pink-600" />
              </SectionCard>

              <SectionCard title="New Grad" icon={FaGraduationCap} gradient="from-emerald-600 to-green-700">
                <LinkCard href="https://github.com/coderQuad/New-Grad-Positions" icon={FaGithub} title="New Grad Positions" subtitle="GitHub repo" color="from-gray-700 to-gray-900" />
                <LinkCard href="https://www.levels.fyi/internships/" icon={BiData} title="Levels.fyi" subtitle="Salary data" color="from-blue-500 to-indigo-600" />
                <LinkCard href="https://careershift.com/" icon={FaBriefcase} title="CareerShift" subtitle="Job search tool" color="from-purple-500 to-violet-600" />
              </SectionCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SectionCard title="Resume & Interview" icon={FaBook} gradient="from-violet-700 to-purple-800">
                <LinkCard href="https://github.com/jakegut/resume" icon={FaGithub} title="Jake's Resume Template" subtitle="Best LaTeX template" color="from-gray-700 to-gray-900" />
                <LinkCard href="https://www.overleaf.com/latex/templates/tagged/cv" icon={FaBook} title="LaTeX CV Templates" subtitle="More templates" color="from-green-600 to-teal-700" />
                <LinkCard href="https://www.techinterviewhandbook.org/" icon={FaCode} title="Tech Interview Handbook" subtitle="Free guide" color="from-blue-500 to-indigo-600" />
                <LinkCard href="https://leetcode.com/" icon={FaCode} title="LeetCode" subtitle="Coding practice" color="from-yellow-500 to-orange-600" />
              </SectionCard>

              <SectionCard title="Communities" icon={FaUsers} gradient="from-orange-600 to-red-700">
                <LinkCard href="https://www.reddit.com/r/cscareerquestions/" icon={FaUsers} title="r/cscareerquestions" subtitle="Reddit community" color="from-orange-500 to-red-600" />
                <LinkCard href="https://www.reddit.com/r/csMajors/" icon={FaUsers} title="r/csMajors" subtitle="Student community" color="from-blue-500 to-indigo-600" />
                <LinkCard href="https://www.meetup.com/hvtech/" icon={FaUsers} title="HV Tech Meetup" subtitle="Local events" color="from-red-500 to-pink-600" />
                <LinkCard href="https://www.linkedin.com/company/open-hub-project/" icon={FaUsers} title="Open Hub" subtitle="Open source" color="from-blue-600 to-blue-800" />
              </SectionCard>

              <SectionCard title="Alumni Network" icon={HiAcademicCap} gradient="from-slate-700 to-slate-900">
                <LinkCard href="https://www.linkedin.com/school/suny-new-paltz/" icon={FaUsers} title="SUNY NP LinkedIn" subtitle="Connect with alumni" color="from-blue-600 to-blue-800" />
                <LinkCard href="https://www.newpaltz.edu/alumni/" icon={HiAcademicCap} title="Alumni Association" subtitle="Official network" color="from-orange-500 to-amber-600" />
              </SectionCard>
            </div>

            {/* Pro Tips Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <FaLightbulb /> Pro Tip: .edu Email Hack
              </h3>
              <p className="text-sm text-white/90">
                Keep your school email active! Sign up for GitHub Student Pack, JetBrains, Azure, Google One AI, and other tools NOW. 
                Many benefits last 1-4 years and some continue after graduation.
              </p>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center mt-10 text-sm text-gray-500">
          <p>Resources curated by the Hydra Lab team. Have a suggestion? <a href="https://github.com/compsci-suny-newpaltz" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">Contribute on GitHub</a></p>
        </div>
      </div>
    </div>
  );
}
