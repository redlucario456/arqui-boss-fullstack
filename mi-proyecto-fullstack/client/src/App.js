import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/proyectos';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [proyectos, setProyectos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [clima, setClima] = useState({ temperatura: '', viento: '', recomendacion: '' });
  const [ubicacion, setUbicacion] = useState('');
  
  // Form states
  const [formNombre, setFormNombre] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMensaje, setFormMensaje] = useState('');
  const [formImagen, setFormImagen] = useState(null);

  useEffect(() => {
    cargarContenido();
    cargarClima();
    const interval = setInterval(cargarClima, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const cargarContenido = async () => {
    try {
      const res = await fetch(API_URL);
      const datos = await res.json();
      setProyectos(datos.filter(p => !p.imageUrl.includes('default.jpg')));
      setMensajes(datos.filter(p => p.imageUrl.includes('default.jpg')));
    } catch (err) {
      console.error(err);
    }
  };

  const cargarClima = () => {
    let url = 'http://localhost:3000/api/clima';

    const success = async (pos) => {
      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;
      if (lat === 0 && lon === 0) {
        await cargarDefaultClima();
        return;
      }
      setUbicacion(`Coords: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
      try {
        const res = await fetch(`${url}?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        mostrarClima(data);
      } catch (err) {
        mostrarError();
      }
    };

    const failure = async () => {
      await cargarDefaultClima();
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, failure);
    } else {
      setUbicacion('Ubicación no soportada');
      cargarDefaultClima();
    }
  };

  const cargarDefaultClima = async () => {
    const res = await fetch('http://localhost:3000/api/clima');
    const data = await res.json();
    setUbicacion('Ubicación: predeterminada');
    mostrarClima(data);
  };

  const mostrarClima = (data) => {
    setClima({
      temperatura: data.temperatura,
      viento: data.viento || 0,
      recomendacion: data.recomendacion
    });
  };

  const mostrarError = () => {
    setClima({ temperatura: 'Error', viento: '', recomendacion: '' });
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar?')) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    cargarContenido();
  };

  const editarProyecto = async (proj) => {
    const nuevoTitulo = prompt('Nuevo título', proj.titulo);
    if (nuevoTitulo === null) return;
    const nuevaDesc = prompt('Nueva descripción', proj.descripcion);
    if (nuevaDesc === null) return;

    const formData = new FormData();
    formData.append('titulo', nuevoTitulo);
    formData.append('descripcion', nuevaDesc);
    if (window.confirm('¿Cambiar imagen?')) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = async () => {
        if (fileInput.files[0]) {
          formData.append('imagen', fileInput.files[0]);
        }
        await fetch(`${API_URL}/${proj.id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        cargarContenido();
      };
      fileInput.click();
    } else {
      await fetch(`${API_URL}/${proj.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      cargarContenido();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div>
      <header>
        <h1>ArquiBOSS</h1>
        {token ? (
          <button onClick={handleLogout}>Cerrar Sesión</button>
        ) : (
          <a href="http://localhost:5500/login.html">Acceso Admin</a>
        )}
      </header>
      <div id="climaBox">
        <h2>🌤️ Clima actual</h2>
        <p>{ubicacion}</p>
        <p>🌡️ {clima.temperatura}°C</p>
        <p>{clima.viento > 0 ? `💨 Viento: ${clima.viento} km/h` : '💨 Viento: calma'}</p>
        <p>{clima.recomendacion}</p>
      </div>
      {/* contacto / subir proyecto */}
      <div className="form-container">
        <h2 id="tituloForm">{token ? 'Subir Proyecto' : 'Contacto'}</h2>
        <form onSubmit={async e => {
          e.preventDefault();
          const formData = new FormData();
          formData.append('titulo', formNombre);
          let desc = formMensaje;
          if (!token) desc = `[Email: ${formEmail}] ${desc}`;
          formData.append('descripcion', desc);
          if (formImagen) formData.append('imagen', formImagen);
          
          if (token && !formImagen) { 
            alert('Debes seleccionar una imagen para crear un proyecto'); 
            return; 
          }
          
          try {
            const fetchOptions = {
              method: 'POST',
              body: formData
            };
            if (token) fetchOptions.headers = { 'Authorization': `Bearer ${token}` };
            const resp = await fetch(API_URL, fetchOptions);
            const data = await resp.json();
            
            if (!resp.ok) {
              alert('Error: ' + (data.message || data.msg || 'No se pudo enviar'));
              return;
            }
            
            alert('Enviado con éxito');
            setFormNombre('');
            setFormEmail('');
            setFormMensaje('');
            setFormImagen(null);
            cargarContenido();
          } catch (error) {
            alert('Error: ' + error.message);
          }
        }}>
          <input type="text" value={formNombre} onChange={e => setFormNombre(e.target.value)} placeholder={token ? 'Título del proyecto' : 'Nombre / Título'} required />
          {!token && (
            <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="Tu Email" />
          )}
          {token && (
            <input type="file" accept="image/*" onChange={e => setFormImagen(e.target.files[0])} />
          )}
          <textarea value={formMensaje} onChange={e => setFormMensaje(e.target.value)} placeholder={token ? 'Descripción del proyecto' : 'Mensaje...'} required></textarea>
          <button type="submit" className="btn-main">Enviar</button>
        </form>
      </div>
      {/* proyectos and mensajes listing */}
      <section id="proyectos">
        <h2>Portafolio de Proyectos</h2>
        <div className="proyectos-grid">
          {proyectos.map(p => (
            <div key={p.id} className="proyecto-item">
              <img src={`http://localhost:3000/${p.imageUrl}`} alt="" />
              <h3>{p.titulo}</h3>
              <p>{p.descripcion}</p>
              {token && (
                <div className="btn-container">
                  <button className="btn-main" onClick={() => editarProyecto(p)}>Editar</button>
                  <button className="btn-delete" onClick={() => eliminar(p.id)}>Borrar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {token && (
        <div id="seccionMensajesAdmin">
          <h2>Buzón de Consultas Privado</h2>
          {mensajes.length ? mensajes.map(m => (
            <div key={m.id} className="mensaje-card">
              <div className="mensaje-texto"><strong>{m.titulo}</strong>: {m.descripcion}</div>
              <button className="btn-delete" onClick={() => eliminar(m.id)}>Borrar</button>
            </div>
          )) : 'Buzón vacío.'}
        </div>
      )}
      <footer>
        <p>© 2026 ArquiBOSS - Proyectos Arquitectónicos</p>
        <a href="https://instagram.com" className="insta-link">📸</a>
      </footer>
    </div>
  );
}

export default App;