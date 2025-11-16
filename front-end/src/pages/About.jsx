function About() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img src="/brand/university logo.png" alt="University logo" className="w-36 h-36 object-contain rounded-lg bg-white p-3 shadow" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='/user.jpg'}} />
          <div>
            <h1 className="text-3xl font-bold text-[#002147]">About the Faculty of Computing</h1>
            <p className="mt-2 text-gray-600">University of Sri Jayewardenepura</p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              The Faculty of Computing at the University of Sri Jayewardenepura provides modern computing education and research
              tailored to national and global needs. The Faculty focuses on producing graduates skilled in software engineering,
              knowledge engineering, information systems, and scientific computing to support industry and research sectors.
            </p>
          </div>
        </div>

        {/* Departments & Programs */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-[#002147]">Departments</h3>
            <ul className="mt-3 text-gray-700 list-disc list-inside">
              <li>Department of Information Systems Engineering &amp; Informatics</li>
              <li>Department of Knowledge Engineering &amp; Communication</li>
              <li>Department of Scientific Computing</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-[#002147]">Undergraduate Programs</h3>
            <p className="mt-3 text-gray-700 text-sm">The Faculty offers undergraduate degree programs that combine theoretical foundations with hands-on training in computing disciplines.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-[#002147]">Postgraduate &amp; Research</h3>
            <p className="mt-3 text-gray-700 text-sm">Postgraduate courses and research opportunities are available, supporting advanced study in computing, AI, and data science fields.</p>
          </div>
        </div>

        {/* Research & Facilities */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-[#002147]">Research &amp; Innovation</h4>
            <p className="mt-2 text-gray-700 text-sm">The Faculty engages in research across computational disciplines, collaborating with national centres and industry partners to tackle real-world problems.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-[#002147]">Facilities</h4>
            <p className="mt-2 text-gray-700 text-sm">Modern computer labs, access to specialized software, and online learning platforms (LMS) support teaching and student learning.</p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-[#002147]">Contact &amp; Location</h4>
          <p className="mt-2 text-gray-700 text-sm">Faculty of Computing, University of Sri Jayewardenepura — Gangodawila, Nugegoda, Sri Lanka.</p>
          <p className="mt-2 text-gray-700 text-sm">For official information, visit the university website or the Faculty's LMS and academic pages.</p>
        </section>
      </section>
    </div>
  );
}

export default About;