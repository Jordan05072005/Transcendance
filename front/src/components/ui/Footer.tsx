import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 group">
            <div className="h-4 w-full" />
            <footer className="bg-black/90 border-t border-[#33ff00]/30 py-3 px-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <div className="flex justify-center items-center gap-8 font-mono text-sm">
                    <Link
                        to="/privacy-policy"
                        className="text-[#33ff00]/70 hover:text-[#33ff00] transition-colors uppercase tracking-wider"
                    >
                        Privacy Policy
                    </Link>
                    <span className="text-[#33ff00]/30">|</span>
                    <Link
                        to="/terms-of-service"
                        className="text-[#33ff00]/70 hover:text-[#33ff00] transition-colors uppercase tracking-wider"
                    >
                        Terms of Service
                    </Link>
                </div>
            </footer>
        </div>
    );
}
