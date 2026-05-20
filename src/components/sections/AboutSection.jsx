// frontend/src/components/sections/AboutSection.jsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Data Dummy dengan URL gambar placeholder yang berfungsi
const teamMembers = [
  { 
    id: 1, 
    name: 'Alex Peppin', 
    role: 'CEO', 
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500', 
    story: 'Alex started Ten Thirty to help the community by providing top-notch environmental compliance solutions.' 
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    role: 'Operations Manager', 
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=500', 
    story: 'Michael ensures that every project runs smoothly and meets all regulatory standards.' 
  },
  { 
    id: 3, 
    name: 'David Smith', 
    role: 'Lead Designer', 
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=500', 
    story: 'Working hard to build sustainable systems, David brings years of design expertise.' 
  },
  { 
    id: 4, 
    name: 'Sarah Connor', 
    role: 'Lead Engineer', 
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500', 
    story: 'Sarah ensures all septic and environmental systems are engineered to perfection.' 
  }
]

export default function AboutSection() {
  const [selectedMember, setSelectedMember] = useState(null)

  return (
    <section id="about" className="py-20 bg-[#F5F4F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Text Area */}
        <div className="md:w-1/3">
          <h2 className="text-4xl font-bold text-[#2D3D2D] mb-4 font-display">About Us</h2>
          <p className="text-[#6B7A6B] leading-relaxed">
            We are a team of dedicated professionals working together to protect public health through expert environmental solutions.
          </p>
        </div>

        {/* Carousel Area */}
        <div className="md:w-2/3 flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
          {teamMembers.map((member) => (
            <motion.div 
              key={member.id}
              whileHover={{ scale: 1.02 }}
              className="min-w-[260px] h-[360px] relative rounded-2xl overflow-hidden cursor-pointer snap-center shadow-lg flex-shrink-0"
              onClick={() => setSelectedMember(member)}
            >
              <img 
                src={member.img} 
                alt={member.name} 
                className="w-full h-full object-cover" 
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A1A]/90 via-[#1A2A1A]/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg font-display">{member.name}</h3>
                <p className="text-white/80 text-sm font-medium">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Popup (Narasi Cerita) */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 bg-[#1A2A1A]/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FAFAF7] rounded-2xl max-w-lg w-full p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-[#8FA38F] hover:text-white transition-colors"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={selectedMember.img} 
                  alt={selectedMember.name} 
                  className="w-16 h-16 rounded-full object-cover shadow-md"
                />
                <div>
                  <h3 className="text-2xl font-bold text-[#2D3D2D] font-display">{selectedMember.name}</h3>
                  <p className="text-sm font-semibold text-[#8FA38F]">{selectedMember.role}</p>
                </div>
              </div>
              
              <p className="text-[#6B7A6B] leading-relaxed">
                {selectedMember.story}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}