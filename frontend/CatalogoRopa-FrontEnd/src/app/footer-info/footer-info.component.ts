import { Component,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';



type ContenidoPagina = {
  titulo: string;
  parrafos: string[];
};

@Component({
  selector: 'app-footer-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-info.component.html',
  styleUrl: './footer-info.component.css',
})


export class FooterInfoComponent {
  private route = inject(ActivatedRoute);

  contenido: Record<string, ContenidoPagina> = {
    'quienes-somos': {
      titulo: '¿Quiénes somos?',
      parrafos: [
        'TUROPA.COM es una tienda de ropa que se dedica a ofrecer una amplia variedad de prendas de vestir modernas, comodas',
        'y de alta calidad, Contamos con un catalogo en linea que puede ser consultado por cualquier persona interesada en adquirir',
        'alguna de nuestras prendas en sucursales fisicas.',
      ]
    },

    'sucursales': {
      titulo: 'Sucursales',
      parrafos: [
        'Actualmente contamos con 2 sucursales y solo entregas en tienda fisica.',
        'En un futuro expandiremos nuestras operaciones para ofrecer entregas a domicilio y llegar a mas clientes en todo el pais.',
      ]
    },

    'medio-ambiente': {
      titulo: 'Politicas de Medio Ambiente',
      parrafos: [
        'En TUROPA.COM buscamos promover practicas responsables en el uso de materiales, empaques y procesos de venta.',
        'Nuestro compromiso es reducir el desperdicio y fomentar decisiones de compra mas conscientes.'
      ]
    },


    'ayuda': {
      titulo: 'Ayuda',
      parrafos: [
        'En esta seccion podras encontrar informacion general para resolver dudas sobre compras, productos y uso del sitio.',
        'Si necesitas asistencia adicional, puedes consultar la seccion de contacto.'
      ]
    },


        'preguntas-frecuentes': {
      titulo: 'Preguntas Frecuentes',
      parrafos: [
        'Aqui encontraras respuestas a las preguntas mas comunes sobre productos, precios, promociones y disponibilidad.',
        'La informacion puede actualizarse conforme se agreguen nuevas funciones al catalogo.'
      ]
    },

    'contacto': {
      titulo: 'Contacto',
      parrafos: [
        'Puedes comunicarte con nosotros para resolver dudas sobre productos, pedidos o informacion general.',
        'Correo de contacto: contacto@turopa.com',
        'Horario de atencion: lunes a viernes de 9:00 a.m. a 6:00 p.m.'
      ]
    },

 'terminos': {
      titulo: 'Terminos y Condiciones',
      parrafos: [
        'Al utilizar este sitio aceptas las condiciones de uso establecidas por TUROPA.COM.',
        'La informacion de productos, precios y promociones puede cambiar sin previo aviso.'
      ]
    },

  'privacidad': {
      titulo: 'Politicas de Privacidad',
      parrafos: [
        'TUROPA.COM protege la informacion personal proporcionada por sus usuarios.',
        'Los datos se utilizan unicamente para fines relacionados con el funcionamiento del sitio y la atencion al cliente.'
      ]
    }
  };

  get pagina(): ContenidoPagina {
    const slug = this.route.snapshot.paramMap.get('slug') ?? 'ayuda';

    return this.contenido[slug] ?? {
      titulo: 'pagina no encontrada',
      parrafos: ['La informacion solicitada no esta disponible. Por favor, verifica la URL o regresa a la pagina de ayuda para mas informacion.']
    
    };
  }
  }