import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const validateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    let calculatedAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    return calculatedAge >= 18;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        dateOfBirth: data.dateOfBirth
      });
      toast.success('¡Registro exitoso! Bienvenido a ChatWeb');
      navigate('/chat');
    } catch (error: any) {
      toast.error(error.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <motion.div 
        className="form-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="form-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Únete a ChatWeb
        </motion.h1>
        
        <motion.p 
          style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Crea tu cuenta para empezar a chatear
        </motion.p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="form-label">
              <User size={16} style={{ marginRight: '8px' }} />
              Nombre Completo
            </label>
            <input
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Tu nombre completo"
              {...register('name', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                },
                maxLength: {
                  value: 50,
                  message: 'El nombre no puede exceder 50 caracteres'
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: 'El nombre solo puede contener letras y espacios'
                }
              })}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </motion.div>

          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="form-label">
              <Mail size={16} style={{ marginRight: '8px' }} />
              Correo Electrónico
            </label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="tu@email.com"
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Email inválido'
                }
              })}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </motion.div>

          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="form-label">
              <Calendar size={16} style={{ marginRight: '8px' }} />
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
              {...register('dateOfBirth', {
                required: 'La fecha de nacimiento es requerida',
                validate: {
                  isAdult: (value) => validateAge(value) || 'Debes ser mayor de 18 años para registrarte'
                }
              })}
            />
            {errors.dateOfBirth && (
              <span className="error-message">{errors.dateOfBirth.message}</span>
            )}
          </motion.div>

          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="form-label">
              <Lock size={16} style={{ marginRight: '8px' }} />
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                style={{ paddingRight: '50px' }}
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
                  }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </motion.div>

          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label className="form-label">
              <Lock size={16} style={{ marginRight: '8px' }} />
              Confirmar Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirma tu contraseña"
                style={{ paddingRight: '50px' }}
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: (value) => value === password || 'Las contraseñas no coinciden'
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
            )}
          </motion.div>

          <motion.button
            type="submit"
            className="form-button"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </motion.button>
        </form>

        <motion.div 
          className="form-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
