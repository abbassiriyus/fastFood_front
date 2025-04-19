"use client"
import React, { useState } from 'react';
import styles from '../styles/orders.module.css'; // CSS faylini import qilish
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      date: '2023-04-18T12:34:56Z',
      items: [
        { id: 1, name: 'Mahsulot 1', quantity: 2, price: 10 },
        { id: 2, name: 'Mahsulot 2', quantity: 1, price: 20 }
      ],
      total: 40,
      status: 'completed' // Bajarilgan
    },
    {
      id: 2,
      date: '2023-04-19T09:15:30Z',
      items: [
        { id: 3, name: 'Mahsulot 3', quantity: 1, price: 15 },
        { id: 4, name: 'Mahsulot 4', quantity: 3, price: 5 }
      ],
      total: 30,
      status: 'pending' // Yangi
    },
    {
      id: 3,
      date: '2023-04-20T14:45:00Z',
      items: [
        { id: 5, name: 'Mahsulot 5', quantity: 2, price: 25 }
      ],
      total: 50,
      status: 'completed' // Bajarilgan
    }
  ]);

  const [filter, setFilter] = useState('all'); // Filtr state

  const filteredOrders = orders.filter(order => {
    if (filter === 'completed') return order.status === 'completed';
    if (filter === 'pending') return order.status === 'pending';
    return true; // Barcha buyurtmalar
  });

  return (
    <div style={{maxWidth:'600px',margin:'auto'}}>
      <Navbar />
      <div  className={styles.ordersContainer}>
        <h2 className={styles.ordersTitle}>Buyurtmalar</h2>
        
        <div className={styles.filter}>
          <button onClick={() => setFilter('all')} className={styles.filterButton}>Barchasi</button>
          <button onClick={() => setFilter('completed')} className={styles.filterButton}>Bajarilgan</button>
          <button onClick={() => setFilter('pending')} className={styles.filterButton}>Yangi</button>
        </div>
        
        <div className={styles.ordersList}>
          {filteredOrders.length === 0 ? (
            <p className={styles.emptyMessage}>Hech qanday buyurtma yo'q.</p>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className={styles.orderItem}>
                <h3 className={styles.orderId}>Buyurtma ID: {order.id}</h3>
                <p className={styles.orderDate}>Sana: {new Date(order.date).toLocaleDateString()}</p>
                <div className={styles.orderDetails}>
                  <h4 className={styles.orderDetailsTitle}>Buyurtma Tafsilotlari:</h4>
                  {order.items.map(item => (
                    <div key={item.id} className={styles.orderDetail}>
                      <p>{item.name} - {item.quantity} x ${item.price}</p>
                    </div>
                  ))}
                </div>
                <p className={styles.orderTotal}>
                  Umumiy: ${order.total}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;