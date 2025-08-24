"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Folder, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Share, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  FolderPlus,
  Filter,
  SortAsc,
  Star,
  Heart,
  X,
  Save
} from "lucide-react";
import Navbar from '@/components/layout/navbar';

interface ScannedCard {
  id: string;
  name: string;
  company?: string;
  position?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  date?: string;
  notes?: string;
  imageData?: string;
  croppedImageData?: string;
  folderId?: string;
  isFavorite?: boolean;
  tags?: string[];
  sector?: string;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  description?: string;
  cardCount: number;
  createdAt: string;
}

export default function CollectionPage() {
  const [cards, setCards] = useState<ScannedCard[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCardId, setShareCardId] = useState<string | null>(null);
  const [selectedCardForPreview, setSelectedCardForPreview] = useState<ScannedCard | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCardData, setEditingCardData] = useState<ScannedCard | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'company'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'recent'>('all');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('bg-blue-500');
  const [newFolderDescription, setNewFolderDescription] = useState('');

  // localStorage'dan gerçek kartları yükle
  useEffect(() => {
    // Önceden kaydettiğin kartları localStorage'dan oku
    const loadCardsFromStorage = () => {
      try {
        const savedCards = localStorage.getItem('scannedCards');
        const realCards: ScannedCard[] = savedCards ? JSON.parse(savedCards) : [];
        
        console.log(`${realCards.length} gerçek kart localStorage'dan yüklendi`, realCards);
        // Image verisi kontrolü
        realCards.forEach((card, index) => {
          console.log(`Kart ${index + 1}:`, {
            name: card.name,
            hasImageData: !!card.imageData,
            imageDataLength: card.imageData ? card.imageData.length : 0,
            hasCroppedImageData: !!card.croppedImageData,
            croppedImageDataLength: card.croppedImageData ? card.croppedImageData.length : 0
          });
        });
        return realCards;
      } catch (error) {
        console.error('Kartlar yüklenirken hata:', error);
        return [];
      }
    };

    const realCards = loadCardsFromStorage();
    
    // Demo kartlar
    const mockCards: ScannedCard[] = [
      {
        id: '1',
        name: 'Özgür Çakır',
        company: 'BMC Otomotiv',
        position: 'Program Management Director',
        email: 'ozgur.cakir@bmc.com.tr',
        phone: '+90 232 477 18 00',
        website: 'www.bmc.com.tr',
        location: 'İzmir',
        date: '2024-01-15',
        folderId: 'work',
        isFavorite: true,
        tags: ['otomotiv', 'iş'],
        sector: 'Otomotiv',
        imageData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDM1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJtMyA5IDktN3YxMWwtOS03eiIvPgo8cGF0aCBkPSJtMjEgOS03IDd2LTEubDctN3oiLz4KPHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPHN2ZyB4PSIyMDAiIHk9IjMwIiB3aWR0aD0iMTMwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ3aGl0ZSI+PHRleHQgeD0iMCIgeT0iMjgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+Qk1DIE90b21vdGl2PC90ZXh0Pjwvc3ZnPgo8c3ZnIHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIzMDAiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIj4KPHN2ZyB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIj4KPHBhdGggZD0iTTQgNGgxNmMxLjEgMCAyIC45IDIgMnYxMmMwIDEuMS0uOSAyLTIgMkg0Yy0xLjEgMC0yLS45LTItMlY2YzAtMS4xLjktMiAyLTJaIi8+CjxwYXRoIGQ9Im0yMiA2LTEwIDctTCAyIDZoMTZoMDAiLz4KPHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPHN2ZyB4PSIzMCIgeT0iMCIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyMCIgZmlsbD0id2hpdGUiPjx0ZXh0IHg9IjAiIHk9IjE1IiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSI+b3pndXIuY2FraXJAYm1jLmNvbS50cjwvdGV4dD48L3N2Zz4KPC9zdmc+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjM0I4MkY2Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzhCNUNGNiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg=='
      },
      {
        id: '2', 
        name: 'Manolis Georgoulis',
        company: 'Smart Rent A Car',
        position: 'Manager',
        email: 'smartchios@hotmail.com',
        phone: '+22710-21666',
        website: 'www.smartchios.gr',
        location: 'Chios',
        date: '2024-01-10',
        folderId: 'travel',
        isFavorite: false,
        tags: ['travel', 'yunanistan'],
        sector: 'Turizm',
        imageData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDM1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNNyAxN1Y5YzAtLjUtLjUtMS0xLTFINGMtLjUgMC0xIC41LTEgMXY4aDR6Ii8+CjxwYXRoIGQ9Im0yMCA5LTEwIDEwLTMtM20xMy0xaDMiLz4KPHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPHN2ZyB4PSIyMDAiIHk9IjMwIiB3aWR0aD0iMTMwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ3aGl0ZSI+PHRleHQgeD0iMCIgeT0iMjgiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+U21hcnQgUmVudDwvdGV4dD48L3N2Zz4KPHN2ZyB4PSIyMCIgeT0iMTQwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ3aGl0ZSI+CjxzdmcgeD0iMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0zIDkgOS03djExbC05LTd6Ii8+CjxwYXRoIGQ9Im0yMSA5LTcgN3YtMWw3LTd6Ii8+CjxzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+CjxzdmcgeD0iMzAiIHk9IjAiIHdpZHRoPSIyNTAiIGhlaWdodD0iMjAiIGZpbGw9IndoaXRlIj48dGV4dCB4PSIwIiB5PSIxNSIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiPnNtYXJ0Y2hpb3NAaG90bWFpbC5jb208L3RleHQ+PC9zdmc+CjwvdBdmc+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMTBCOTgxIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA1OWY3ZiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg=='
      }
    ];

    const mockFolders: Folder[] = [
      {
        id: 'work',
        name: 'İş Kontakları',
        color: 'bg-blue-500',
        description: 'İş dünyasından kişiler',
        cardCount: 15,
        createdAt: '2024-01-01'
      },
      {
        id: 'travel',
        name: 'Seyahat',
        color: 'bg-green-500', 
        description: 'Seyahatlerde tanıştığım kişiler',
        cardCount: 8,
        createdAt: '2024-01-05'
      },
      {
        id: 'network',
        name: 'Networking',
        color: 'bg-purple-500',
        description: 'Etkinliklerden kontaklar',
        cardCount: 23,
        createdAt: '2024-01-03'
      }
    ];

    // Gerçek kartlar + demo kartları birleştir
    const allCards = [...realCards, ...mockCards];
    setCards(allCards);
    setFolders(mockFolders);
  }, []);

  // Klasör oluşturma
  const createFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName,
      color: newFolderColor,
      description: newFolderDescription,
      cardCount: 0,
      createdAt: new Date().toISOString()
    };

    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setNewFolderDescription('');
    setNewFolderColor('bg-blue-500');
    setShowNewFolderModal(false);
  };

  // Çoklu kartvizit paylaşımı
  const shareMultipleCards = async () => {
    const selectedCardsList = cards.filter(card => selectedCards.has(card.id));
    if (selectedCardsList.length === 0) return;

    let shareText = `🔗 ${selectedCardsList.length} Kartvizit Paylaşımı\n\n`;
    
    selectedCardsList.forEach((card, index) => {
      shareText += `${index + 1}. 👤 ${card.name}\n`;
      if (card.company) shareText += `🏢 ${card.company}\n`;
      if (card.position) shareText += `💼 ${card.position}\n`;
      if (card.email) shareText += `📧 ${card.email}\n`;
      if (card.phone) shareText += `📞 ${card.phone}\n`;
      if (card.website) shareText += `🌐 ${card.website}\n`;
      shareText += '\n';
    });
    
    shareText += '💫 RAVENKART ile oluşturuldu';

    // Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedCardsList.length} Kartvizit Paylaşımı`,
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: kopyala
      await navigator.clipboard.writeText(shareText);
      alert(`${selectedCardsList.length} kartvizit bilgileri panoya kopyalandı!`);
    }
  };

  // Kartvizit paylaşımı
  const shareCard = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    // Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.name} - Kartvizit`,
          text: `${card.name}${card.company ? ` - ${card.company}` : ''}\n${card.email || ''}\n${card.phone || ''}`,
          url: `${window.location.origin}/card/${cardId}`
        });
      } catch (err) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: kopyala
      const shareText = `🔗 Kartvizit Paylaşımı\n\n👤 ${card.name}\n${card.company ? `🏢 ${card.company}\n` : ''}${card.position ? `💼 ${card.position}\n` : ''}${card.email ? `📧 ${card.email}\n` : ''}${card.phone ? `📞 ${card.phone}\n` : ''}${card.website ? `🌐 ${card.website}\n` : ''}\n\n💫 RAVENKART ile oluşturuldu`;
      
      await navigator.clipboard.writeText(shareText);
      alert('Kartvizit bilgileri panoya kopyalandı!');
    }
  };

  // Kart kaydetme fonksiyonu
  const saveCard = () => {
    if (!editingCardData) return;

    // localStorage'dan mevcut kartları al
    const savedCards = localStorage.getItem('scannedCards');
    const existingCards: ScannedCard[] = savedCards ? JSON.parse(savedCards) : [];
    
    // Kartı güncelle
    const updatedCards = existingCards.map(card => 
      card.id === editingCardData.id ? editingCardData : card
    );
    
    // localStorage'a kaydet
    localStorage.setItem('scannedCards', JSON.stringify(updatedCards));
    
    // State'leri güncelle
    setCards(prev => prev.map(card => 
      card.id === editingCardData.id ? editingCardData : card
    ));
    
    setSelectedCardForPreview(editingCardData);
    setIsEditMode(false);
    setEditingCardData(null);
  };

  // VCard indirme
  const downloadVCard = (card: ScannedCard) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
${card.company ? `ORG:${card.company}` : ''}
${card.position ? `TITLE:${card.position}` : ''}
${card.email ? `EMAIL:${card.email}` : ''}
${card.phone ? `TEL:${card.phone}` : ''}
${card.website ? `URL:${card.website}` : ''}
${card.notes ? `NOTE:${card.notes}` : ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtreleme ve sıralama
  const filteredCards = cards
    .filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFolder = selectedFolder ? card.folderId === selectedFolder : true;
      
      const matchesFilter = filterBy === 'all' ? true :
                           filterBy === 'favorites' ? card.isFavorite :
                           filterBy === 'recent' ? new Date(card.date || '').getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 :
                           filterBy === 'work' ? card.folderId === 'work' :
                           filterBy === 'travel' ? card.folderId === 'travel' :
                           filterBy === 'izmir' ? card.location?.toLowerCase().includes('izmir') :
                           filterBy === 'greece' ? card.location?.toLowerCase().includes('chios') || card.tags?.includes('yunanistan') :
                           filterBy === 'otomotiv' ? card.sector?.toLowerCase().includes('otomotiv') :
                           filterBy === 'turizm' ? card.sector?.toLowerCase().includes('turizm') :
                           filterBy === 'teknoloji' ? card.sector?.toLowerCase().includes('teknoloji') :
                           filterBy === 'finansal' ? card.sector?.toLowerCase().includes('finansal') :
                           filterBy === 'saglik' ? card.sector?.toLowerCase().includes('sağlık') || card.sector?.toLowerCase().includes('saglik') : true;
      
      return matchesSearch && matchesFolder && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        case 'date':
        default:
          return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
      }
    });

  return (
    <>
      <Navbar />
      <div 
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)',
          paddingTop: '5rem'
        }}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-4">
              💼 Kartvizit Kolleksiyonum
            </h1>
            <p className="text-white/70 text-lg">
              Tüm kartvizitlerinizi organize edin, klasörlere ayırın ve kolayca paylaşın
            </p>
          </div>

          {/* Toolbar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 animate-slide-up">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Sol taraf - Arama ve Filtreler */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Arama */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Kişi, şirket veya email ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Filtreler */}
                <div className="flex gap-2">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as any)}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:border-white/60 transition-colors"
                  >
                    <option value="all">Tümü</option>
                    <option value="favorites">Favoriler</option>
                    <option value="recent">Son 7 Gün</option>
                    <option value="work">İş Kartları</option>
                    <option value="travel">Seyahat</option>
                    <option value="izmir">İzmir</option>
                    <option value="greece">Yunanistan</option>
                    <option value="otomotiv">Otomotiv Sektörü</option>
                    <option value="turizm">Turizm Sektörü</option>
                    <option value="teknoloji">Teknoloji Sektörü</option>
                    <option value="finansal">Finansal Sektörü</option>
                    <option value="saglik">Sağlık Sektörü</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:border-white/60 transition-colors"
                  >
                    <option value="date">Tarihe Göre</option>
                    <option value="name">İsme Göre</option>
                    <option value="company">Şirkete Göre</option>
                  </select>
                </div>
              </div>

              {/* Sağ taraf - View Mode ve Aksiyonlar */}
              <div className="flex items-center gap-4">
                {/* View Mode */}
                <div className="flex bg-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Çoklu Seçim */}
                <button
                  onClick={() => {
                    setIsMultiSelectMode(!isMultiSelectMode);
                    if (isMultiSelectMode) {
                      setSelectedCards(new Set());
                    }
                  }}
                  className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                    isMultiSelectMode 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={isMultiSelectMode}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-500 rounded focus:ring-blue-400"
                  />
                  {selectedCards.size > 0 ? `${selectedCards.size} seçili` : 'Çoklu Seç'}
                </button>

                {/* Çoklu Seçim Aksiyonları */}
                {isMultiSelectMode && selectedCards.size > 0 && (
                  <button
                    onClick={shareMultipleCards}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <Share className="w-4 h-4" />
                    {selectedCards.size} Kartı Paylaş
                  </button>
                )}

                {/* Yeni Klasör */}
                <button
                  onClick={() => setShowNewFolderModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <FolderPlus className="w-4 h-4" />
                  Yeni Klasör
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sol Sidebar - Klasörler */}
            <div className="lg:col-span-1 animate-fade-in">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Klasörler</h3>
                  <span className="text-white/60 text-sm">{folders.length} klasör</span>
                </div>

                {/* Tümü Seçeneği */}
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full p-3 rounded-xl mb-2 flex items-center gap-3 transition-colors ${
                    selectedFolder === null 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                  <span>Tüm Kartvizitler</span>
                  <span className="ml-auto text-sm">{cards.length}</span>
                </button>

                {/* Klasör Listesi */}
                <div className="space-y-2">
                  {folders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors hover:scale-102 ${
                        selectedFolder === folder.id 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className={`w-4 h-4 ${folder.color} rounded`}></div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{folder.name}</div>
                        {folder.description && (
                          <div className="text-xs text-white/50">{folder.description}</div>
                        )}
                      </div>
                      <span className="text-sm">{folder.cardCount}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ana İçerik - Kartvizitler */}
            <div className="lg:col-span-3 animate-fade-in">
              {/* Sonuç Sayısı */}
              <div className="mb-6">
                <p className="text-white/70">
                  {filteredCards.length} kartvizit bulundu
                  {selectedFolder && folders.find(f => f.id === selectedFolder) && 
                    ` • ${folders.find(f => f.id === selectedFolder)?.name}`
                  }
                </p>
              </div>

              {/* Kartvizit Listesi */}
              {filteredCards.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Kartvizit bulunamadı</h3>
                  <p className="text-white/60">Arama kriterlerinizi değiştirin veya yeni kartvizit ekleyin</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {filteredCards.map(card => (
                    <CardItem 
                      key={card.id} 
                      card={card} 
                      viewMode={viewMode}
                      onToggleFavorite={(id) => {
                        setCards(prev => prev.map(c => 
                          c.id === id ? {...c, isFavorite: !c.isFavorite} : c
                        ));
                      }}
                      onShare={shareCard}
                      onDownload={downloadVCard}
                      onCardClick={(card) => setSelectedCardForPreview(card)}
                      isMultiSelectMode={isMultiSelectMode}
                      isSelected={selectedCards.has(card.id)}
                      onToggleSelect={(cardId) => {
                        const newSelected = new Set(selectedCards);
                        if (newSelected.has(cardId)) {
                          newSelected.delete(cardId);
                        } else {
                          newSelected.add(cardId);
                        }
                        setSelectedCards(newSelected);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Folder Modal */}
        {showNewFolderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewFolderModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-6">Yeni Klasör Oluştur</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Klasör Adı</label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Klasör adını girin..."
                    className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Açıklama (Opsiyonel)</label>
                  <textarea
                    value={newFolderDescription}
                    onChange={(e) => setNewFolderDescription(e.target.value)}
                    placeholder="Klasör açıklaması..."
                    rows={2}
                    className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-3">Klasör Rengi</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-rose-500'].map(color => (
                      <button
                        key={color}
                        onClick={() => setNewFolderColor(color)}
                        className={`w-10 h-10 ${color} rounded-lg border-2 transition-all ${
                          newFolderColor === color ? 'border-white' : 'border-transparent hover:border-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewFolderModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-400 border border-gray-400/30 rounded-xl hover:bg-gray-500/30 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Oluştur
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Card Preview Modal */}
        {selectedCardForPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCardForPreview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-white">
                    {selectedCardForPreview.name}
                  </h3>
                  <button
                    onClick={() => setSelectedCardForPreview(null)}
                    className="p-2 text-white/60 hover:text-white rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Kartvizit Preview Image */}
                {(selectedCardForPreview.croppedImageData || selectedCardForPreview.imageData) && (
                  <div className="mb-6">
                    <img 
                      src={selectedCardForPreview.croppedImageData || selectedCardForPreview.imageData}
                      alt={`${selectedCardForPreview.name} kartvizit`}
                      className="w-full rounded-xl border border-white/20 shadow-2xl"
                    />
                  </div>
                )}

                {/* Detaylar */}
                {isEditMode && editingCardData ? (
                  // Edit Mode - Form
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">İsim</label>
                        <input
                          type="text"
                          value={editingCardData.name || ''}
                          onChange={(e) => setEditingCardData({...editingCardData, name: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Pozisyon</label>
                        <input
                          type="text"
                          value={editingCardData.position || ''}
                          onChange={(e) => setEditingCardData({...editingCardData, position: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Şirket</label>
                        <input
                          type="text"
                          value={editingCardData.company || ''}
                          onChange={(e) => setEditingCardData({...editingCardData, company: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Sektör</label>
                        <input
                          type="text"
                          value={editingCardData.sector || ''}
                          onChange={(e) => setEditingCardData({...editingCardData, sector: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Email</label>
                        <input
                          type="email"
                          value={editingCardData.email || ''}
                          onChange={(e) => setEditingCardData({...editingCardData, email: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Telefon</label>
                        <input
                          type="text"
                          value={editingCardData.phone || ''}
                          onChange={(e) => setEditingCardData({...editingCardData, phone: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Website</label>
                        <input
                          type="text"
                          value={editingCardData.website || ''}
                          onChange={(e) => setEditingCardData({...editingCardData, website: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Konum</label>
                        <input
                          type="text"
                          value={editingCardData.location || ''}
                          onChange={(e) => setEditingCardData({...editingCardData, location: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode - Display
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-1">İsim</label>
                        <p className="text-white font-semibold">{selectedCardForPreview.name}</p>
                      </div>
                    {selectedCardForPreview.position && (
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Pozisyon</label>
                        <p className="text-white">{selectedCardForPreview.position}</p>
                      </div>
                    )}
                    {selectedCardForPreview.company && (
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Şirket</label>
                        <p className="text-white">{selectedCardForPreview.company}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {selectedCardForPreview.email && (
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Email</label>
                        <p className="text-white">{selectedCardForPreview.email}</p>
                      </div>
                    )}
                    {selectedCardForPreview.phone && (
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Telefon</label>
                        <p className="text-white">{selectedCardForPreview.phone}</p>
                      </div>
                    )}
                    {selectedCardForPreview.website && (
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Website</label>
                        <p className="text-white">{selectedCardForPreview.website}</p>
                      </div>
                    )}
                    {selectedCardForPreview.location && (
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Konum</label>
                        <p className="text-white">{selectedCardForPreview.location}</p>
                      </div>
                    )}
                    {selectedCardForPreview.sector && (
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Sektör</label>
                        <p className="text-white">{selectedCardForPreview.sector}</p>
                      </div>
                    )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedCardForPreview.tags && selectedCardForPreview.tags.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-white/60 text-sm mb-2">Etiketler</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCardForPreview.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm text-white">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                  {isEditMode ? (
                    // Edit Mode Buttons
                    <>
                      <button
                        onClick={() => {
                          setIsEditMode(false);
                          setEditingCardData(null);
                        }}
                        className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        İptal
                      </button>
                      <button
                        onClick={saveCard}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        Kaydet
                      </button>
                    </>
                  ) : (
                    // View Mode Buttons
                    <>
                      <button
                        onClick={() => {
                          setIsEditMode(true);
                          setEditingCardData({...selectedCardForPreview});
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Edit className="w-5 h-5" />
                        Düzenle
                      </button>
                      <button
                        onClick={() => shareCard(selectedCardForPreview.id)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Share className="w-5 h-5" />
                        Paylaş
                      </button>
                      <button
                        onClick={() => downloadVCard(selectedCardForPreview)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        İndir
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}

// Kartvizit bileşeni
function CardItem({ 
  card, 
  viewMode, 
  onToggleFavorite,
  onShare,
  onDownload,
  onCardClick,
  isMultiSelectMode,
  isSelected,
  onToggleSelect
}: { 
  card: ScannedCard; 
  viewMode: 'grid' | 'list';
  onToggleFavorite: (id: string) => void;
  onShare: (id: string) => void;
  onDownload: (card: ScannedCard) => void;
  onCardClick: (card: ScannedCard) => void;
  isMultiSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (cardId: string) => void;
}) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up">
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          {isMultiSelectMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect?.(card.id)}
              className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
            />
          )}
          
          {/* Avatar/Image */}
          <div 
            className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onCardClick(card)}
          >
            {(card.croppedImageData || card.imageData) ? (
              <img 
                src={card.croppedImageData || card.imageData}
                alt={`${card.name} kartvizit`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                {card.name.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Bilgiler */}
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">{card.name}</h3>
            {card.position && card.company && (
              <p className="text-white/60">{card.position} • {card.company}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
              {card.email && <span>{card.email}</span>}
              {card.phone && <span>{card.phone}</span>}
            </div>
          </div>

          {/* Aksiyonlar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(card.id)}
              className={`p-2 rounded-lg transition-colors ${
                card.isFavorite 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-white/40 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-5 h-5 ${card.isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            <button 
              onClick={() => onShare(card.id)}
              className="p-2 text-white/40 hover:text-white rounded-lg transition-colors"
            >
              <Share className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => onDownload(card)}
              className="p-2 text-white/40 hover:text-green-400 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group animate-slide-up hover:scale-105 hover:-translate-y-1"
      onClick={() => !isMultiSelectMode && onCardClick(card)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        {/* Checkbox */}
        {isMultiSelectMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect?.(card.id);
            }}
            className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
          />
        )}
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          {card.name.charAt(0)}
        </div>
        
        <button
          onClick={() => onToggleFavorite(card.id)}
          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
            card.isFavorite 
              ? 'text-yellow-400 hover:text-yellow-300 opacity-100' 
              : 'text-white/40 hover:text-yellow-400'
          }`}
        >
          <Star className={`w-5 h-5 ${card.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* İçerik */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-lg">{card.name}</h3>
        
        {card.position && (
          <p className="text-white/60 text-sm">{card.position}</p>
        )}
        
        {card.company && (
          <p className="text-white/80 font-medium">{card.company}</p>
        )}
        
        {card.sector && (
          <p className="text-white/50 text-sm">📊 {card.sector}</p>
        )}

        {card.email && (
          <p className="text-white/50 text-sm">{card.email}</p>
        )}

        {card.phone && (
          <p className="text-white/50 text-sm">{card.phone}</p>
        )}
      </div>

      {/* Preview Image */}
      {(card.croppedImageData || card.imageData) && (
        <div className="mt-4 mb-4">
          <img 
            src={card.croppedImageData || card.imageData}
            alt={`${card.name} kartvizit`}
            className="w-full h-24 object-cover rounded-lg border border-white/10"
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          {card.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/60">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onShare(card.id)}
            className="p-1.5 text-white/40 hover:text-white rounded-lg transition-colors"
          >
            <Share className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDownload(card)}
            className="p-1.5 text-white/40 hover:text-green-400 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-white/40 hover:text-red-400 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}