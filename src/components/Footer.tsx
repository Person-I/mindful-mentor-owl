const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground text-center font-bold">
              From <a href="mailto:karolwiater0@gmail.com" className="text-primary">Karol</a> and <a href="mailto:ciubajacek@gmail.com" className="text-primary">Jacek</a> with ❤️
            </span>
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
