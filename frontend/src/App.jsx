import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect, useCallback } from 'react';
import apiClient from './api';

function App() {
  const { keycloak, initialized } = useKeycloak();

 
  const [items, setitems] = useState([]);
  const [newItemName, setNewItemName] = useState('');

 
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItemName, setEditedItemName] = useState('');

 

  const fetchitems = useCallback(async () => {
    if (keycloak.hasRealmRole('app-leitor')) {
      try {
        const response = await apiClient.get('/items');
        setitems(response.data);
      } catch (error) {
        console.error('Erro ao buscar items:', error);
        alert('Falha ao carregar items. Você tem permissão?');
      }
    }
  }, [keycloak]);

  useEffect(() => {
    if (keycloak.authenticated) {
      fetchitems();
    }
  }, [keycloak.authenticated, fetchitems]);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/items', { name: newItemName });
      setNewItemName('');
      fetchitems();
    } catch (error) {
      console.error('Erro ao criar item:', error);
      alert('Falha ao criar item. Verifique suas permissões.');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await apiClient.delete(`/items/${id}`);
      fetchitems();
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      alert('Falha ao deletar item. Verifique suas permissões.');
    }
  };
  
  const handleUpdateItem = async (id) => {
    try {
      await apiClient.patch(`/items/${id}`, { name: editedItemName });
      setEditingItemId(null);
      fetchitems();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      alert('Falha ao atualizar item. Verifique suas permissões.');
    }
  };

  const startEdit = (item) => {
    setEditingItemId(item.id);
    setEditedItemName(item.name);
  };

  const cancelEdit = () => {
    setEditingItemId(null);
  };


  if (!initialized) {
    return <div>Carregando e conectando ao Keycloak...</div>;
  }

  return (
    <div className="app-container">
      <h1>Sistema de items com NestJS, React & Keycloak</h1>

      {!keycloak.authenticated ? (
        <button className="btn-login" onClick={() => keycloak.login()}>Login</button>
      ) : (
        <>
          <section className="header-section">
            <p>Olá, <strong>{keycloak.tokenParsed.preferred_username}</strong>!</p>
            <button className="btn-logout" onClick={() => keycloak.logout()}>Logout</button>
          </section>

          {keycloak.hasRealmRole('app-criador') && (
            <section className="form-section">
              <h2>Criar Novo Item</h2>
              <form onSubmit={handleCreateItem}>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Nome do novo item"
                  required
                />
                <button className="btn-add" type="submit">Adicionar</button>
              </form>
            </section>
          )}

          <section className="list-section">
            <h2>Lista de items</h2>
            {keycloak.hasRealmRole('app-leitor') ? (
              <ul className="item-list">
                {items.map((item) => (
                  <li key={item.id}>
                    {editingItemId === item.id ? (
                     
                      <>
                        <input
                          type="text"
                          value={editedItemName}
                          onChange={(e) => setEditedItemName(e.target.value)}
                        />
                        <div className="item-actions">
                          <button className="btn-save" onClick={() => handleUpdateItem(item.id)}>Salvar</button>
                          <button className="btn-cancel" onClick={cancelEdit}>Cancelar</button>
                        </div>
                      </>
                    ) : (
                     
                      <>
                        <span>{item.name}</span>
                        <div className="item-actions">
                          {keycloak.hasRealmRole('app-editor') && (
                            <button className="btn-edit" onClick={() => startEdit(item)}>Editar</button>
                          )}
                          {keycloak.hasRealmRole('app-removedor') && (
                            <button className="btn-delete" onClick={() => handleDeleteItem(item.id)}>Excluir</button>
                          )}
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Você não tem permissão para visualizar os items.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default App;