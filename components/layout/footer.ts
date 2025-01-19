const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="font-bold">Company Name</h4>
            <p className="text-gray-600">Some description or tagline.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Facebook
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
