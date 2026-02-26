import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import logo from '../../assets/patientreg.png';

const Footer = () => {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
            <div className="const-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand */}
                <div className="space-y-6">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={logo} alt="Medicare" className="h-8 w-auto" />
                        <span className="text-xl font-display font-bold text-primary">Medicare</span>
                    </Link>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Redefining healthcare with a focus on premium service, advanced technology, and patient-centric care.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <FaFacebookF size={14} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <FaTwitter size={14} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <FaInstagram size={14} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <FaLinkedinIn size={14} />
                        </a>
                    </div>
                </div>

                {/* Links 1 */}
                <div>
                    <h4 className="font-display font-bold text-lg mb-6 text-primary">Services</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-accent transition-colors">General Consultation</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Specialist Care</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Wellness Programs</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Diagnostic Imaging</a></li>
                    </ul>
                </div>

                {/* Links 2 */}
                <div>
                    <h4 className="font-display font-bold text-lg mb-6 text-primary">Company</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Our Specialists</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">News & Press</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="font-display font-bold text-lg mb-6 text-primary">Stay Updated</h4>
                    <p className="text-gray-500 text-sm mb-4">Subscribe to our newsletter for the latest health tips and updates.</p>
                    <form className="flex">
                        <input 
                            type="email" 
                            placeholder="Your email" 
                            className="flex-1 bg-surface border-none px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                        <button type="submit" className="bg-primary text-white px-4 py-3 hover:bg-accent transition-colors">
                            Ok
                        </button>
                    </form>
                </div>
            </div>

            <div className="const-container pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                <p>&copy; {new Date().getFullYear()} Medicare Premium Healthcare. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
