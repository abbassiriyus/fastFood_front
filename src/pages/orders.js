"use client";
import React, { useEffect, useState } from 'react';
import styles from '../styles/orders.module.css'; // CSS faylini import qilish
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import url from '@/host/host';
import { io } from 'socket.io-client';

const socket = io(`${url}`); // Socket.io serveriga ulanish

const Orders = () => {
  const [orders, setOrders] = useState([]);

  function formatDateTime(dateTime) {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    const date = new Date(dateTime);
    return date.toLocaleString('uz-UZ', options);
  }

  function getZakaz() {
    let myShop = [];
    if (localStorage.getItem('myshop')) {
      myShop = JSON.parse(localStorage.getItem('myshop'));
    }
    axios.get(`${url}/zakaz`).then(res => {
      let filter_myShop = [];
      for (let i = 0; i < myShop.length; i++) {
        for (let j = 0; j < res.data.length; j++) {
          if (myShop[i] == res.data[j].id) {
            filter_myShop.push(res.data[j]);
          }
        }
      }

      axios.get(`${url}/zakaz_products`).then(res1 => {
        axios.get(`${url}/products`).then(res4 => {
          for (let i = 0; i < res1.data.length; i++) {
            for (let j = 0; j < res4.data.length; j++) {
              if (res1.data[i].product_id == res4.data[j].id) {
                res1.data[i].name = res4.data[j].name;
              }
            }
          }

          for (let i = 0; i < filter_myShop.length; i++) {
            filter_myShop[i].items = [];
            filter_myShop[i].total = 0;

            for (let j = 0; j < res1.data.length; j++) {
              if (filter_myShop[i].id == res1.data[j].zakaz_id) {
                filter_myShop[i].items.push(res1.data[j]);
                filter_myShop[i].total += (res1.data[j].count * res1.data[j].price);
              }
            }
          }
        axios.get(`${url}/offitsant`).then(res5=>{
       for (let i = 0; i < filter_myShop.length; i++) {
       for (let j = 0; j < res5.data.length; j++) {
        if(filter_myShop[i].status!=0 && res5.data[j].id==filter_myShop[i].user_id){
          filter_myShop[i].username=res5.data[j].username
        }
        }} 

          setOrders(filter_myShop);
        }).catch(err=>{

        })

        
        });
      }).catch(err => {
        console.error(err);
      });
    }).catch(err => {
      console.error(err);
    });
  }

  const [filter, setFilter] = useState(0); // Filtr state

  const filteredOrders = orders.filter(order => {
    if (filter == '1') return order.status == '1';
    if (filter == '2') return order.status == '2';
    if (filter == '0') return order.status == '0';
  });

  useEffect(() => {
    getZakaz();

    // Socket.io hodisalarini tinglash
    socket.on('zakazUpdated', () => {
      getZakaz(); // Yangilangan buyurtmalarni olish
    });

    return () => {
      socket.off('zakazUpdated'); // Komponent o'chirilganda hodisani o'chirish
    };
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Navbar />
      <div className={styles.ordersContainer}>
        <h2 className={styles.ordersTitle}>Buyurtmalar</h2>

        <div className={styles.filter}>
          <button onClick={() => setFilter('0')} className={styles.filterButton}>Yangi</button>
          <button onClick={() => setFilter('1')} className={styles.filterButton}>Bajarilmoqda</button>
          <button onClick={() => setFilter('2')} className={styles.filterButton}>Bajarilgan</button>
        </div>

        <div className={styles.ordersList}>
          {filteredOrders.length === 0 ? (
            <p className={styles.emptyMessage}>Hech qanday buyurtma yo'q.</p>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} style={{
                backgroundColor: order.status === 0 ? '#ff00004a' :
                  order.status === 1 ? '#0080004a' :
                    order.status === 2 ? '#ffa5004a' : 'white'
              }} className={styles.orderItem}>
                <h3 className={styles.orderId}>Buyurtma ID: {order.id}</h3>
                <p className={styles.orderDate}>Sana: {formatDateTime(order.created_at)}</p>
                 {order.status!=0?(order.username?(<p >offitsant: {order.username}</p>):(<h4>Vakant</h4>)):("") }
                <div className={styles.orderDetails}>
                <h4 className={styles.orderDetailsTitle}>Buyurtma Tafsilotlari:</h4>
                 
                  {order.items.map(item => (
                    <div key={item.id} className={styles.orderDetail}>
                      <p>{item.name} - {item.count} x ${item.price}</p>
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