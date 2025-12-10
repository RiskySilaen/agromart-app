class AgroMartDB {
  // --- PRODUCTS (Fetch dari API) ---
  async getProducts() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (error) {
      console.error("Gagal ambil produk:", error);
      return [];
    }
  }

  // --- ADMIN: TAMBAH PRODUK ---
  async addProduct(productData) {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (!res.ok) {
         const errorData = await res.json();
         throw new Error(errorData.message || 'Gagal menambah produk');
      }

      return await res.json();
    } catch (error) {
      console.error("Gagal tambah produk:", error);
      return { success: false, message: error.message || "Error koneksi" };
    }
  }

  // --- ADMIN: HAPUS PRODUK (BARU) ---
  async deleteProduct(id) {
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus produk');
      }

      return await res.json();
    } catch (error) {
      console.error("Gagal hapus produk:", error);
      return { success: false, message: error.message || "Error koneksi" };
    }
  }

  // --- AUTH (Fetch dari API) ---
  async registerUser(name, email, phone, password) {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (data.success) {
        this.setCurrentUser(data.user);
      }
      return data;
    } catch (error) {
      return { success: false, message: "Terjadi kesalahan koneksi" };
    }
  }

  async loginUser(email, password) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        this.setCurrentUser(data.user);
      }
      return data;
    } catch (error) {
      return { success: false, message: "Terjadi kesalahan koneksi" };
    }
  }

  // --- CART (Tetap LocalStorage) ---
  getCart() {
    return JSON.parse(localStorage.getItem("agromart_cart")) || [];
  }

  // Fungsi helper: Tambah ke cart dengan detail lengkap
  addToCartWithDetails(product, quantity = 1) {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        quantity,
        name: product.name,
        price: product.price,
        rating: product.rating,
        image: product.image || "", // Simpan gambar agar muncul di keranjang
      });
    }
    localStorage.setItem("agromart_cart", JSON.stringify(cart));
    return true;
  }

  // Fungsi lama (fallback)
  addToCart(productId, quantity = 1) {
    return false; 
  }

  updateCartItem(productId, quantity) {
    const cart = this.getCart();
    const itemIndex = cart.findIndex((item) => item.productId === productId);
    if (itemIndex !== -1) {
      if (quantity <= 0) cart.splice(itemIndex, 1);
      else cart[itemIndex].quantity = quantity;
      localStorage.setItem("agromart_cart", JSON.stringify(cart));
      return true;
    }
    return false;
  }

  removeFromCart(productId) {
    const cart = this.getCart();
    const newCart = cart.filter((item) => item.productId !== productId);
    localStorage.setItem("agromart_cart", JSON.stringify(newCart));
    return true;
  }

  clearCart() {
    localStorage.setItem("agromart_cart", JSON.stringify([]));
    return true;
  }

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  setCurrentUser(user) {
    localStorage.setItem("agromart_current_user", JSON.stringify(user));
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("agromart_current_user"));
  }

  logoutUser() {
    localStorage.setItem("agromart_current_user", JSON.stringify(null));
  }
  
  saveOrder(paymentMethod) {
     const cart = this.getCart();
     const currentUser = this.getCurrentUser();
     
     if (cart.length === 0) return { success: false, message: "Keranjang kosong" };

     const newOrder = {
      id: Date.now(),
      userId: currentUser ? currentUser.id : null,
      userName: currentUser ? currentUser.name : "Guest",
      items: [...cart],
      total: this.getCartTotal(),
      paymentMethod,
      date: new Date().toISOString(),
    };
    
    // Simpan local sementara
    const orders = JSON.parse(localStorage.getItem("agromart_orders")) || [];
    orders.push(newOrder);
    localStorage.setItem("agromart_orders", JSON.stringify(orders));
    this.clearCart();
    return { success: true, order: newOrder };
  }
  
  // --- CONTACT ---
  async saveContact(name, email, phone, message) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      
      if (!res.ok) throw new Error('Gagal mengirim');
      
      return await res.json();
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
      return { success: false, message: "Gagal terhubung ke server" };
    }
  }
}

export const db = new AgroMartDB();