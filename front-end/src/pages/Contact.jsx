function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#002147] mb-6">
            Contact the Faculty of Computing
          </h1>
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            For official enquiries about academic matters, admissions, or student services, please
            consult the Faculty LMS or contact the Faculty office using the listed official
            channels below. This portal provides informational contact details only — students
            should not use this page to submit assignments or formal requests.
          </p>
        </div>
      </section>

      {/* Contact Info (Faculty of Computing) */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Faculty Contact Details */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-[#002147] mb-4">Faculty of Computing — Contact Information</h2>
              <p className="text-gray-700 mb-4">Below are official contact details and useful links. Students should use the Faculty LMS or official university channels rather than sending direct emails through this portal.</p>

              <div className="space-y-6">
                {/* Address intentionally removed per design: location/contact map not required */}

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                  <p className="text-gray-600">+94 11 275 8000</p>
                  <p className="text-gray-600">+94 11 280 2022</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Email (General)</h4>
                  <p className="text-gray-600">info@sjp.ac.lk</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Official Links</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    <li><a href="/" className="text-[#002147] hover:underline">University Website</a></li>
                    <li><a href="/brand/university logo.png" className="text-[#002147] hover:underline">Faculty Logo</a></li>
                    <li><a href="https://lms.foc.sjp.ac.lk/" target="_blank" rel="noreferrer" className="text-[#002147] hover:underline">Faculty LMS</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Visiting Hours / Guidance */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Visitor & Student Guidance</h3>
              <p className="text-gray-700 mb-4">For administrative matters, course registration, or academic enquiries, please consult the Faculty office during working hours or use the Faculty LMS for student services and announcements.</p>

              <h4 className="font-semibold text-gray-800 mt-4">Office Hours</h4>
              <p className="text-gray-600">Monday — Friday: 9:00 AM — 4:00 PM (local time)</p>

              <h4 className="font-semibold text-gray-800 mt-4">Student Support</h4>
              <p className="text-gray-600">Students should use the Faculty LMS for submitting requests, accessing course materials and official announcements. For urgent matters, contact the Faculty office by phone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Visit section removed — not required for this portal per design */}
    </div>
  );
}

export default Contact;