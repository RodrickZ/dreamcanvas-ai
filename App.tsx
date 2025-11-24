import React, { useState, useCallback, useRef } from 'react';
import { SparklesIcon, DownloadIcon, TrashIcon, PhotoIcon, SwatchIcon } from './components/Icons';
import { Button, AspectRatioSelector } from './components/ui';
import { generateImageFromText } from './services/geminiService';
import { AspectRatio, GeneratedImage } from './types';

const STYLES = [
  "Photorealistic",
  "Anime",
  "Cyberpunk",
  "Oil Painting",
  "Watercolor",
  "Sketch",
  "3D Render",
  "Pixel Art"
];

const EXAMPLE_PROMPTS = [
  "A futuristic city with neon lights and flying cars in a cyberpunk style",
  "A cute robot gardening in a sunlit greenhouse, macro photography",
  "An ancient library floating in the clouds, dreamlike atmosphere",
  "A majestic lion made of fire and smoke, dramatic lighting"
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  // Refs for scrolling
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Append style to prompt if selected
      const finalPrompt = selectedStyle 
        ? `${prompt}, ${selectedStyle} style, high quality, detailed` 
        : prompt;

      const result = await generateImageFromText(finalPrompt, aspectRatio);
      
      setCurrentImage(result);
      setHistory(prev => [result, ...prev]);
      
      // Scroll to result on mobile/small screens
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, aspectRatio, selectedStyle]);

  const handleDownload = (imageUrl: string, id: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `dreamcanvas-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your gallery?")) {
      setHistory([]);
      setCurrentImage(null);
    }
  };

  const handleSurpriseMe = () => {
    const randomPrompt = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setPrompt(randomPrompt);
  };

  return (
    <div className="min-h-screen bg-darker text-gray-100 selection:bg-primary/30">
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-darker/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              DreamCanvas
            </h1>
          </div>
          <div className="text-xs text-gray-500 font-medium px-2 py-1 rounded bg-slate-900 border border-slate-800">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Section */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            
            {/* Prompt Input */}
            <div className="bg-surface rounded-2xl p-6 border border-slate-700 shadow-xl shadow-black/20">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full"></span>
                  Prompt
                </label>
                <button 
                  onClick={handleSurpriseMe}
                  className="text-xs text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
                >
                  <SparklesIcon className="w-3 h-3" />
                  Surprise Me
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to see... e.g. A cat astronaut exploring Mars"
                  className="w-full h-32 bg-dark rounded-xl border-slate-700 text-gray-100 placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary p-4 resize-none transition-all duration-200"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {prompt.length} chars
                </div>
              </div>

              {/* Styles */}
              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                  <SwatchIcon className="w-4 h-4 text-gray-400" />
                  Style (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(style => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selectedStyle === style
                          ? 'bg-primary text-white border-primary'
                          : 'bg-dark border-slate-700 text-gray-400 hover:border-slate-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Config Section */}
            <div className="bg-surface rounded-2xl p-6 border border-slate-700 shadow-xl shadow-black/20">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-4">
                <PhotoIcon className="w-4 h-4 text-gray-400" />
                Aspect Ratio
              </label>
              <AspectRatioSelector selected={aspectRatio} onChange={setAspectRatio} />
              
              <div className="mt-8">
                <Button 
                  onClick={handleGenerate} 
                  isLoading={isGenerating} 
                  disabled={!prompt.trim()}
                  className="w-full py-3 text-lg"
                >
                  Generate Image
                </Button>
                {error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions/Tips */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-sm text-gray-500">
              <p className="mb-2 font-medium text-gray-400">Pro Tips:</p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>Be descriptive about lighting and mood.</li>
                <li>Specify an art style for better results.</li>
                <li>Try different aspect ratios for portraits vs landscapes.</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8" ref={resultRef}>
            
            {/* Main Preview Area */}
            <div className="bg-surface rounded-3xl border border-slate-700 overflow-hidden shadow-2xl shadow-black/40 min-h-[500px] flex flex-col relative group">
               {currentImage ? (
                  <div className="relative w-full h-full flex-grow bg-darker/50 flex items-center justify-center p-4">
                    <img 
                      src={currentImage.url} 
                      alt={currentImage.prompt} 
                      className="max-h-[70vh] w-auto rounded-lg shadow-lg object-contain"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        variant="secondary" 
                        onClick={() => handleDownload(currentImage.url, currentImage.id)}
                        className="!p-2.5 rounded-full"
                        title="Download"
                      >
                        <DownloadIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
               ) : (
                 <div className="flex-grow flex flex-col items-center justify-center text-gray-500 p-12 text-center">
                   {isGenerating ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-primary animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <SparklesIcon className="w-6 h-6 text-primary animate-pulse" />
                          </div>
                        </div>
                        <p className="text-lg font-medium text-gray-300 animate-pulse">Creating your masterpiece...</p>
                        <p className="text-sm">This usually takes 5-10 seconds</p>
                      </div>
                   ) : (
                      <>
                        <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 transform rotate-3">
                          <PhotoIcon className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-300 mb-2">Ready to Create</h3>
                        <p className="max-w-md mx-auto">
                          Enter a prompt on the left and hit generate to see the magic happen.
                        </p>
                      </>
                   )}
                 </div>
               )}
            </div>

            {/* History Gallery */}
            {history.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <span className="w-1 h-4 bg-secondary rounded-full"></span>
                    Recent Creations
                  </h2>
                  <Button variant="ghost" onClick={handleClearHistory} className="text-sm !px-2 !py-1">
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {history.map((img) => (
                    <div 
                      key={img.id} 
                      className={`group relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 cursor-pointer transition-all ${currentImage?.id === img.id ? 'ring-2 ring-primary' : 'hover:border-gray-500'}`}
                      onClick={() => setCurrentImage(img)}
                    >
                      <img 
                        src={img.url} 
                        alt={img.prompt} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                        <p className="text-xs text-white line-clamp-2 mb-2">{img.prompt}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDownload(img.url, img.id); }}
                          className="self-end text-white/80 hover:text-white"
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
