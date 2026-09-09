import React, { useState } from 'react';
import { Search, Filter, Sprout, ShieldCheck, MapPin, Award, ArrowRight, ShoppingCart, Mic } from 'lucide-react';
import { Product, CropCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedProduct, matchesMultilingualProductSearch, CROP_CATEGORY_LABELS } from '../../utils/productLocalization';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { VoiceAssistantModal } from '../../components/common/VoiceAssistantModal';

interface MarketplacePageProps {
  onNavigate: (path: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate }) => {
  const { role, isAuthenticated, updateUserBalance } = useAuth();
  const { formatCurrency, showToast, products, addOrder, addTransaction, updateProduct } = useApp();
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQuantityKg, setOrderQuantityKg] = useState<number>(1000);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ product: Product; quantityKg: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categoryLabels = CROP_CATEGORY_LABELS[language] || CROP_CATEGORY_LABELS.en;

  const categories = [
    { id: 'all', label: categoryLabels.all || t('market.all_crops', 'All Crops') },
    { id: 'grains_cereals', label: categoryLabels.grains_cereals || t('market.grains', 'Grains & Rice') },
    { id: 'vegetables', label: categoryLabels.vegetables || t('market.vegetables', 'Vegetables') },
    { id: 'pulses', label: categoryLabels.pulses || t('market.pulses', 'Pulses & Dals') },
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = matchesMultilingualProductSearch(prod, searchQuery, language);
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlaceOrder = () => {
    if (!selectedProduct) return;
    const locProd = getLocalizedProduct(selectedProduct, language);
    const now = new Date().toISOString();
    const orderId = `ord-${Date.now()}`;
    addOrder({
      id: orderId,
      orderNumber: `FD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      farmerId: selectedProduct.farmerId,
      farmerName: selectedProduct.farmerName,
      buyerId: 'current-buyer',
      buyerName: 'Current Consumer',
      buyerType: 'retail',
      items: [{
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        cropName: selectedProduct.cropName,
        quantityKg: orderQuantityKg,
        pricePerKg: selectedProduct.pricePerKg,
        subtotal: orderQuantityKg * selectedProduct.pricePerKg,
      }],
      totalQuantityKg: orderQuantityKg,
      itemsSubtotal: orderQuantityKg * selectedProduct.pricePerKg,
      transportationFee: 3500,
      totalAmount: orderQuantityKg * selectedProduct.pricePerKg + 3500,
      status: 'pending',
      paymentStatus: 'escrow_held',
      deliveryAddress,
      createdAt: now,
      updatedAt: now,
    });
    updateProduct(selectedProduct.id, {
      availableQuantityKg: Math.max(0, selectedProduct.availableQuantityKg - orderQuantityKg),
    });
    addTransaction({
      id: `TXN-${Date.now()}`,
      orderId,
      type: 'escrow_deposit',
      payerId: 'current-buyer',
      payerName: 'Current Consumer',
      payeeId: selectedProduct.farmerId,
      payeeName: selectedProduct.farmerName,
      amount: orderQuantityKg * selectedProduct.pricePerKg + 3500,
      paymentMethod: 'Marketplace Checkout',
      referenceId: `FD-${Date.now()}`,
      timestamp: now,
      status: 'successful',
    });
    updateUserBalance(selectedProduct.farmerId, orderQuantityKg * selectedProduct.pricePerKg);
    showToast(
      'success',
      language === 'te' ? 'ఆర్డర్ విజయవంతంగా నమోదు అయ్యింది!' : language === 'hi' ? 'ऑर्डर सफलतापूर्वक दर्ज हुआ!' : 'Escrow Procurement Initiated!',
      language === 'te'
        ? `${selectedProduct.farmerName} రైతు వద్ద నుండి ${orderQuantityKg.toLocaleString('en-IN')} కిలోల ${locProd.cropName} ఆర్డర్ బ్యాంక్ ఎస్క్రో రక్షణతో ఖరారు చేయబడింది.`
        : language === 'hi'
        ? `किसान ${selectedProduct.farmerName} से ${orderQuantityKg.toLocaleString('en-IN')} किलो ${locProd.cropName} का ऑर्डर सुरक्षित बैंक एस्क्रो में दर्ज हो गया है।`
        : `Order for ${orderQuantityKg.toLocaleString()} Kg of ${selectedProduct.cropName} submitted to smart escrow.`
    );
    setSelectedProduct(null);
    if (role === 'buyer') {
      onNavigate('/buyer/orders');
    } else {
      onNavigate('/buyer');
    }
  };

  const selectedLocProduct = selectedProduct ? getLocalizedProduct(selectedProduct, language) : null;

  const addToCart = () => {
    if (!selectedProduct) return;
    setCartItems((items) => {
      const existing = items.find((item) => item.product.id === selectedProduct.id);
      if (existing) {
        return items.map((item) => item.product.id === selectedProduct.id
          ? { ...item, quantityKg: item.quantityKg + orderQuantityKg }
          : item);
      }
      return [...items, { product: selectedProduct, quantityKg: orderQuantityKg }];
    });
    showToast('success', 'Added to Cart', `${selectedLocProduct?.cropName} was added to your cart.`);
    setSelectedProduct(null);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.quantityKg * item.product.pricePerKg, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="max-w-2xl space-y-3 z-10 relative">
          <Badge variant="emerald" size="sm">
            {t('market.tag', 'Direct Producer Marketplace')}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            {t('market.title', 'Farm-Fresh Crops Directly from Farmers')}
          </h1>
          <p className="text-sm text-emerald-200/90 leading-relaxed">
            {t('market.subtitle', 'Eliminate commission agents. Browse verified lots straight from farmer fields with certified moisture tests, quality grading, and transparent pricing.')}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search with Audio Input */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Input
              placeholder={t('market.search_placeholder', 'Search crop, variety, or district (e.g. Wheat, Tomato, Nashik)...')}
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsVoiceOpen(true)}
            title={t('market.voice_tooltip', 'Voice Search (Speak in Telugu, Hindi, or English)')}
            className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center"
          >
            <Mic className="w-5 h-5 text-emerald-600 animate-pulse" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {role === 'buyer' && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            icon={ShoppingCart}
            onClick={() => setIsCartOpen(true)}
          >
            Cart ({cartItems.length})
          </Button>
        </div>
      )}

      {/* Produce Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
          <p className="text-base text-slate-600 font-medium">
            {t('market.no_results', 'No crops found matching your search. Tap the mic to speak crop name.')}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            {language === 'te' ? 'అన్ని పంటలను చూడండి' : language === 'hi' ? 'सभी फसलें देखें' : 'Reset Search'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const loc = getLocalizedProduct(prod, language);
            return (
              <Card
                key={prod.id}
                padding="none"
                className="overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={prod.images[0]}
                      alt={loc.cropName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <Badge variant="neutral" size="sm" className="bg-white/95 backdrop-blur-xs font-semibold text-slate-800">
                        {loc.grade}
                      </Badge>
                      {prod.isOrganic && (
                        <Badge variant="success" size="sm" className="bg-emerald-800 text-white">
                          {loc.organicBadge}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="text-[11px] bg-slate-900/85 text-white px-2.5 py-1 rounded-lg backdrop-blur-xs font-medium">
                        {loc.shelfLife}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {loc.cropName}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {loc.variety}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                        {loc.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{loc.location}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">{prod.farmerName}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {loc.description}
                    </p>

                    {/* Price Disintermediation Comparison */}
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                          {t('market.farmdirect_price', 'Farmer Direct Price')}
                        </p>
                        <p className="text-xl font-extrabold text-emerald-800 font-heading">
                          {formatCurrency(prod.pricePerKg)}
                          <span className="text-xs font-normal text-slate-600">{loc.unitPriceLabel}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {t('market.mandi_rate', 'Mandi Market Rate')}
                        </p>
                        <p className="text-sm font-semibold text-slate-400 line-through">
                          {formatCurrency(prod.mandiBenchmarkPricePerKg)}{loc.unitPriceLabel}
                        </p>
                        <span className="text-[11px] font-bold text-emerald-700">
                          {t('market.farmer_gains', 'Farmer gains +')}{prod.estimatedSavingsPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <span>{t('market.stock_available', 'Stock Available:')} <strong className="text-slate-800">{loc.quantityAvailable}</strong></span>
                      <span>{t('market.min_order', 'Min Order:')} {loc.minimumOrder}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Button
                    variant="primary"
                    className="w-full"
                    size="sm"
                    icon={ShoppingCart}
                    onClick={() => {
                      setCartItems((items) => {
                        const existing = items.find((item) => item.product.id === prod.id);
                        return existing
                          ? items.map((item) => item.product.id === prod.id ? { ...item, quantityKg: item.quantityKg + prod.minimumOrderQuantityKg } : item)
                          : [...items, { product: prod, quantityKg: prod.minimumOrderQuantityKg }];
                      });
                      setIsCartOpen(true);
                    }}
                  >
                    {t('market.procure_btn', 'Buy / Add to Cart')}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Procurement Modal */}
      {selectedProduct && selectedLocProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`${t('market.order_modal_title', 'Buy Fresh Crop:')} ${selectedLocProduct.cropName}`}
          subtitle={`${t('market.order_modal_from', 'Farmer details:')} ${selectedProduct.farmerName} (${selectedLocProduct.location})`}
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('market.quality_grade', 'Quality Grade:')}</span>
                <span className="font-bold text-slate-800">{selectedLocProduct.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('market.unit_price', 'Price per Kg:')}</span>
                <span className="font-bold text-emerald-700">{formatCurrency(selectedProduct.pricePerKg)} {selectedLocProduct.unitPriceLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('market.min_order_qty', 'Minimum Order Quantity:')}</span>
                <span className="font-bold text-slate-800">{selectedLocProduct.minimumOrder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('market.total_lot_avail', 'Total Available Stock:')}</span>
                <span className="font-bold text-slate-800">{selectedLocProduct.quantityAvailable}</span>
              </div>
            </div>

            <Input
              label={t('market.order_qty_label', 'Quantity to Buy (Kg)')}
              type="number"
              min={selectedProduct.minimumOrderQuantityKg}
              max={selectedProduct.availableQuantityKg}
              step={50}
              value={orderQuantityKg}
              onChange={(e) => setOrderQuantityKg(Number(e.target.value))}
            />

            <Input
              label={t('market.delivery_addr_label', 'Delivery Address')}
              placeholder={t('market.delivery_addr_placeholder', 'Enter village/town or shop address')}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />

            {/* Price breakdown */}
            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex justify-between font-medium">
                <span>{selectedLocProduct.cropName} ({orderQuantityKg} {selectedLocProduct.unitPriceLabel.replace('/', '')}):</span>
                <span className="font-bold text-slate-900">{formatCurrency(orderQuantityKg * selectedProduct.pricePerKg)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{language === 'te' ? 'రవాణా వాహనం (అంచనా):' : language === 'hi' ? 'ट्रक व ढुलाई (अनुमानित):' : 'Direct Transit Fleet (Est.):'}</span>
                <span>{formatCurrency(3500)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t('market.zero_commission', '0% Broker Cut • Safe Bank Escrow')}</span>
                <span className="text-emerald-700 font-bold">
                  {language === 'te' ? '₹0 దళారీ ఫీజు' : language === 'hi' ? '₹0 दलाली' : '₹0 Commission'}
                </span>
              </div>
              <div className="border-t border-emerald-200 pt-2 flex justify-between font-bold text-sm text-emerald-950">
                <span>{t('market.estimated_total', 'Total Amount to Pay')}:</span>
                <span className="text-base text-emerald-900 font-extrabold">
                  {formatCurrency(orderQuantityKg * selectedProduct.pricePerKg + 3500)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-100 p-2.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'te'
                  ? 'మీ చెల్లింపు ఫార్మ్‌డైరెక్ట్ బ్యాంక్ ఎస్క్రోలో సురక్షితంగా ఉంటుంది. పంట మీ చిరునామాకు చేరిన తర్వాతే రైతుకు చెల్లించబడుతుంది.'
                  : language === 'hi'
                  ? 'आपकी धनराशि सुरक्षित बैंक एस्क्रो में जमा रहेगी। फसल सही सलामत पहुंचने पर ही किसान को भुगतान होगा।'
                  : 'Funds remain locked in FarmDirect Smart Escrow until produce passes arrival moisture & grade inspection.'}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => setSelectedProduct(null)}
              >
                {language === 'te' ? 'రద్దు చేయండి' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                className="w-1/2"
                onClick={handlePlaceOrder}
              >
                {t('market.fund_order_btn', 'Confirm & Pay Safely')}
              </Button>
            </div>
            <Button variant="outline" className="w-full" icon={ShoppingCart} onClick={addToCart}>
              Add to Cart
            </Button>
          </div>
        </Modal>
      )}

      {isCartOpen && (
        <Modal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Your Cart" subtitle="Review produce quantities before ordering.">
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">Your cart is empty.</p>
            ) : (
              <>
                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => {
                    const loc = getLocalizedProduct(item.product, language);
                    return (
                      <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{loc.cropName}</p>
                          <p className="text-xs text-slate-500">{item.quantityKg.toLocaleString('en-IN')} kg</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-700">{formatCurrency(item.quantityKg * item.product.pricePerKg)}</p>
                          <button type="button" className="text-xs text-rose-600" onClick={() => setCartItems((items) => items.filter((cartItem) => cartItem.product.id !== item.product.id))}>Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Subtotal</span>
                  <span className="text-lg font-bold text-slate-900">{formatCurrency(cartTotal)}</span>
                </div>
                <Button variant="primary" className="w-full" onClick={() => {
                  const firstItem = cartItems[0];
                  setSelectedProduct(firstItem.product);
                  setOrderQuantityKg(firstItem.quantityKg);
                  setIsCartOpen(false);
                }}>
                  Continue to Order
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onNavigate={onNavigate}
        onSearch={(query) => setSearchQuery(query)}
      />
    </div>
  );
};

