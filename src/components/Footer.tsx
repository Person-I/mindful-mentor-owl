const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground text-center">
              Made with Vercel & Lovable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
