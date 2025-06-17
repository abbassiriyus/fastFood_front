'use client';

import React, { useEffect, useState } from 'react';
import LayoutComponent from '../../components/Layout';
import axios from 'axios';
import url from '../../host/host';
import styles from '../../styles/UsersTable.module.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [openSalaryId, setOpenSalaryId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [orders, setOrders] = useState([]);
  const zakazPerPage = 10;
  const [openOrderId, setOpenOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedOrders = orders.slice(
    currentPage * zakazPerPage,
    (currentPage + 1) * zakazPerPage
  );

  const totalPages = Math.ceil(orders.length / zakazPerPage);

  const toggleAccordion = (orderId) => {
    setOpenOrderId(prev => (prev === orderId ? null : orderId));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/users`);
        const filteredUsers = response.data.filter(user => user.type === 1);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Foydalanuvchilarni olishda xatolik:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserOrders = async (userId, date) => {
    try {
      const [zakazRes, zakazProductsRes, productsRes] = await Promise.all([
        axios.get(`${url}/zakaz`),
        axios.get(`${url}/zakaz_products`),
        axios.get(`${url}/products`)
      ]);

      const zakazlar = zakazRes.data;
      const zakazProducts = zakazProductsRes.data;
      const allProducts = productsRes.data;

      const filteredOrders = zakazlar.filter(order => {
        const orderDate = new Date(order.created_at).toISOString().slice(0, 10);
        return order.user_id === userId && orderDate === date;
      });

      const enrichedOrders = filteredOrders.map(order => {
        const relatedZakazProducts = zakazProducts
          .filter(zp => zp.zakaz_id === order.id)
          .map(zp => {
            const productInfo = allProducts.find(p => p.id === zp.product_id);
            return {
              ...zp,
              name: productInfo?.name || 'Nomaʼlum mahsulot',
              image: productInfo?.image || '/no-image.png',
            };
          });

        return {
          ...order,
          zakaz_products: relatedZakazProducts
        };
      });

      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Zakazlarni olishda xatolik:', error);
    }
  };

  const toggleSalaryRow = (userId) => {
    setOpenSalaryId(prevId => (prevId === userId ? null : userId));
  };

  const handlePaySalary = async (userId, price) => {
    const confirmPay = window.confirm("Rostdan ham oylik bermoqchimisiz?");
    if (!confirmPay) return;

    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('price', price * 1);

      await axios.put(`${url}/users/${userId}/reset-count`, { count_seen: 0 });

      await axios.post(`${url}/tarixoylik`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, count_seen: 0 } : user
        )
      );
    } catch (error) {
      console.error('Oylikni berishda xatolik:', error);
    }
  };

  return (
    <LayoutComponent>
      <div className={styles.container}>
        <h2>Foydalanuvchilar ro'yxati</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Status</th>
              <th>Amal</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number || 'Noma’lum'}</td>
                  <td>{user.is_active ? 'Faol' : 'Nofaol'}</td>
                  <td>
                    <button className={styles.button} onClick={() => toggleSalaryRow(user.id)}>
                      {openSalaryId === user.id ? "Yopish" : "Oylikni ko‘rsat"}
                    </button>
                  </td>
                </tr>
                {openSalaryId === user.id && (
                  <tr className={styles.salaryRow}>
                    <td colSpan="6">
                      <strong>Oylik:</strong> {user.count_seen ? `${user.count_seen} so'm` : 'Mavjud emas'}
                      {user.count_seen > 0 && (
                        <button
                          className={`${styles.button} ${styles['button--secondary']}`}
                          onClick={() => handlePaySalary(user.id, user.count_seen * user.prosent / 100)}
                          style={{ marginLeft: '20px' }}
                        >
                          Oylikni berish
                        </button>
                      )}
                      <button
                        className={styles.button}
                        onClick={() => {
                          const today = new Date().toISOString().slice(0, 10);
                          setSelectedUser(user);
                          setModalOpen(true);
                          setSelectedDate(today);
                          setCurrentPage(0);
                          fetchUserOrders(user.id, today);
                        }}
                        style={{ marginLeft: '10px' }}
                      >
                        Zakazlar
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedUser && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>{selectedUser.username} — Zakazlar</h3>

            <label className={styles.label}>
              📅 Sana tanlang:
              <input
                type="date"
                value={selectedDate}
                className={styles.dateInput}
                onChange={(e) => {
                  const date = e.target.value;
                  setSelectedDate(date);
                  fetchUserOrders(selectedUser.id, date);
                }}
              />
            </label>

            {selectedDate && (
              <>
                <h4 className={styles.ordersTitle}>
                  {selectedDate} uchun zakazlar:
                </h4>

                <ul className={styles.orderList}>
                  {paginatedOrders.map(order => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderHeader} onClick={() => toggleAccordion(order.id)}>
                        🧾 Stol: {order.number_stol} — Sana: {order.created_at.slice(0, 10)} — Soat: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>

                      {openOrderId === order.id && (
                        <div className={styles.orderContent}>
                          {order.zakaz_products.length === 0 ? (
                            <p>Mahsulot yo‘q</p>
                          ) : (
                            <>
                              <ul className={styles.productList}>
                                {order.zakaz_products.map(p => (
                                  <li key={p.id} className={styles.productItem}>
                                    <img
                                      src={p.image}
                                      onError={(e) => e.target.src = '/no-image.png'}
                                      className={styles.productImage}
                                    />
                                    <span>{p.name} — {p.count} dona — {p.price.toLocaleString()} so‘m</span>
                                  </li>
                                ))}
                              </ul>
                              <div className={styles.totalAmount}>
                                <strong>Umumiy:</strong> {order.zakaz_products.reduce((sum, p) => sum + p.count * p.price, 0).toLocaleString()} so‘m
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
                        onClick={() => setCurrentPage(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </ul>
              </>
            )}

            <button className={styles.closeButton} onClick={() => setModalOpen(false)}>
              ❌ Yopish
            </button>
          </div>
        </div>
      )}
    </LayoutComponent>
  );
}
