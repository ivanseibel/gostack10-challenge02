import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MdMoreHoriz } from 'react-icons/md';

import api from '../../services/api';
import { changeScreen } from '../../store/modules/auth/actions';

import { Container, Grid, Status } from './styles';
import HeaderRegister from '../../components/RegisterHeader';
import PopupMenu from '../../components/PopupMenu';
import Modal from '../../components/Modal';
import DeliveryDetails from './DeliveryDetails';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deliveryId, setDeliveryId] = useState(null);

  const menuItems = [
    {
      type: 'Details',
      method: toggleShowModal,
    },
    {
      type: 'Edit',
      method: () => {
        console.log('Edit');
      },
    },
    {
      type: 'Delete',
      method: () => {
        console.log('Delete');
      },
    },
  ];

  // TODO: Refactor loadDeliveries and filterDeliveries to unify.

  useEffect(() => {
    async function loadDeliveries() {
      const response = await api.get('deliveries');

      if (response) {
        const data = response.data.map((delivery) => ({
          ...delivery,
          showMenu: false,
        }));
        setDeliveries(data);
      }
    }

    loadDeliveries();
  }, []);

  useEffect(() => {
    async function filterDeliveries() {
      let query = null;

      if (filter.length > 0) {
        query = {
          params: {
            q: filter,
          },
        };
      }

      const response = await api.get('deliveries', query || null);

      if (response) {
        const data = response.data.map((delivery) => ({
          ...delivery,
          showMenu: false,
        }));
        setDeliveries(data);
      }
    }

    filterDeliveries();
  }, [filter]);

  function toggleShowMenu(id) {
    setDeliveries(
      deliveries.map((delivery) => {
        const updated = { ...delivery };

        if (delivery.id === id) {
          updated.showMenu = !delivery.showMenu;
          setDeliveryId(id);
        } else {
          updated.showMenu = false;
        }

        return updated;
      })
    );
  }

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  const dispatch = useDispatch();

  dispatch(changeScreen('deliveries'));

  return (
    <>
      {showModal ? (
        <Modal visible={showModal} toggleShowModal={toggleShowModal}>
          <DeliveryDetails id={deliveryId} />
        </Modal>
      ) : null}

      <Container>
        <HeaderRegister
          screenName="deliveries"
          showControls
          setFilter={setFilter}
        />
        <Grid status="delivered">
          <strong>ID</strong>
          <strong>Recipient</strong>
          <strong>Product</strong>
          <strong>Deliveryman</strong>
          <strong>City</strong>
          <strong>State</strong>
          <strong>Status</strong>
          <strong>Actions</strong>

          {deliveries.map((delivery) => (
            <React.Fragment key={delivery.id}>
              <span>{delivery.id}</span>
              <span>{delivery.recipient.name}</span>
              <span>{delivery.product}</span>
              <span>
                <img
                  src={delivery.deliveryman.avatar.url}
                  alt={delivery.deliveryman.name}
                />
                {delivery.deliveryman.name}
              </span>
              <span>{delivery.recipient.city}</span>
              <span>{delivery.recipient.state}</span>
              <span>
                <Status status={delivery.status}>
                  {delivery.status.toUpperCase()}
                </Status>
              </span>
              <span className="actions">
                <button
                  type="button"
                  onClick={() => {
                    toggleShowMenu(delivery.id);
                  }}
                >
                  <MdMoreHoriz size={20} />
                  <PopupMenu
                    show={delivery.showMenu}
                    menuItems={menuItems}
                    toggleShowMenu={toggleShowMenu}
                  />
                </button>
              </span>
            </React.Fragment>
          ))}
        </Grid>
      </Container>
    </>
  );
}
