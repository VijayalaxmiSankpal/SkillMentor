import { Link } from "react-router-dom";
import { RiBrainLine, RiGithubLine, RiTwitterLine, RiLinkedinLine } from "react-icons/ri";

const PRODUCT_LINKS  = ["Features", "Roadmaps", "AI Mentor", "Resume Review"];
const COMPANY_LINKS  = ["About", "Blog", "Careers", "Contact"];
const RESOURCE_LINKS = ["Documentation", "Community", "Changelog", "Status"];

const Footer = () => {
  return (
    <footer className="border-t border-surface-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-sm">
                <RiBrainLine className="text-white text-lg" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Skill<span className="text-gradient">Mentor</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              AI-powered career and interview preparation platform for the
              next generation of software engineers.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500/40 transition-colors">
                <RiGithubLine />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500/40 transition-colors">
                <RiTwitterLine />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500/40 transition-colors">
                <RiLinkedinLine />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="label mb-4">Product</h4>
            <ul className="flex flex-col gap-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="label mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="label mb-4">Resources</h4>
            <ul className="flex flex-col gap-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} SkillMentor AI. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;