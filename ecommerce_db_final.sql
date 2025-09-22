-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 22-09-2025 a las 23:06:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `idCategoria` int(11) NOT NULL,
  `nombreCategoria` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`idCategoria`, `nombreCategoria`) VALUES
(1, 'Juegos Interactivos'),
(2, 'Juegos de Mesa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `idCliente` int(11) NOT NULL,
  `nombres` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `idUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`idCliente`, `nombres`, `telefono`, `direccion`, `idUsuario`) VALUES
(23, 'Administrador', '123', '127.0.0.1', 44),
(24, 'vendedor', '123', '127.0.0.1', 45),
(49, 'cliente', '1234', 'direccion cliente 1', 49),
(70, 'Javi', '123456', 'Lo Espinoza 2645', 73);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envio`
--

CREATE TABLE `envio` (
  `idEnvio` int(11) NOT NULL,
  `direccionEnvio` varchar(200) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `codigoPostal` varchar(20) DEFAULT NULL,
  `fechaEnvio` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodopago`
--

CREATE TABLE `metodopago` (
  `idMetodoPago` int(11) NOT NULL,
  `nombreMetodo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `metodopago`
--

INSERT INTO `metodopago` (`idMetodoPago`, `nombreMetodo`) VALUES
(1, 'Pago contra entrega'),
(2, 'Transferencia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `idPedido` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `fechaPedido` date NOT NULL,
  `total` int(11) NOT NULL,
  `idMetodoPago` int(11) DEFAULT NULL,
  `idEnvio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`idPedido`, `idCliente`, `fechaPedido`, `total`, `idMetodoPago`, `idEnvio`) VALUES
(40, 49, '0000-00-00', 5000, NULL, NULL),
(41, 49, '0000-00-00', 9500, NULL, NULL),
(42, 49, '0000-00-00', 4500, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidodetalle`
--

CREATE TABLE `pedidodetalle` (
  `idPedidoDetalle` int(11) NOT NULL,
  `idPedido` int(11) NOT NULL,
  `idProducto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precioUnitario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `pedidodetalle`
--

INSERT INTO `pedidodetalle` (`idPedidoDetalle`, `idPedido`, `idProducto`, `cantidad`, `precioUnitario`) VALUES
(33, 40, 51, 1, 5000),
(34, 41, 50, 1, 9500),
(35, 42, 49, 1, 4500);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `idProducto` int(11) NOT NULL,
  `nombreProducto` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` int(11) NOT NULL,
  `idCategoria` int(11) DEFAULT NULL,
  `imagen` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`idProducto`, `nombreProducto`, `descripcion`, `precio`, `idCategoria`, `imagen`) VALUES
(40, 'Cubo Apilable con fichas de encaje', 'Edad: 3+', 500, 1, '/img/1758411970504.jpg'),
(43, 'Bloques en Madera de Colores', 'Edad: 3+', 2500, 1, '/img/1758416682324.jpg'),
(44, 'Búho Musical Multifunción', 'Edad: 3+', 3500, 1, '/img/1758416773164.jpg'),
(45, 'Bloques Magnéticos – 96 pcs', 'Edad: 3+', 5500, 1, '/img/1758416804363.jpg'),
(46, 'Bloques de Bombero Brigada Fire', 'Edad: 8+', 9500, 1, '/img/1758416834757.jpg'),
(47, 'Cubo Multifunción 8 en 1', 'Edad: 5+', 10000, 1, '/img/1758416872752.jpg'),
(48, 'Cubo Apilable con fichas de encaje', 'Edad: 3+', 8000, 1, '/img/1758416900249.jpg'),
(49, 'Dominó Acrílico de Animalitos', 'Edad: 3+', 4500, 2, '/img/1758416923126.jpg'),
(50, 'Juego didáctico La Tiendita', 'Edad: 8+', 9500, 2, '/img/1758416945916.jpg'),
(51, 'Instrumento Musical Maracas de madera', 'Edad: 8+', 5000, 2, '/img/1758416967597.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL,
  `nombreRol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idRol`, `nombreRol`) VALUES
(1, 'Administrador'),
(2, 'Vendedor'),
(3, 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock`
--

CREATE TABLE `stock` (
  `idStock` int(11) NOT NULL,
  `idProducto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `idRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `correo`, `contrasena`, `idRol`) VALUES
(44, 'admin@admin.cl', '$2b$08$sGcdKHABNMlcIAHcpyAT8.dD9OR3XmmI44mUhl.YijR8UFD8XaaXa', 1),
(45, 'vendedor@vendedor.cl', '$2b$08$MSi0Vbi4mLzLqn3Y.SHqHeX5SO.o5Q9naEUaVcu6lYjH.JDWXr5M.', 2),
(49, 'cliente@cliente.cl', '$2b$08$Vnv0lDAcAi/mK2sPSfqIzefXh3dv.hJKpHsnH1.nnRWyPz9I2WU26', 3),
(53, 'nuevocliente@nuevo.cl', '$2b$08$TDhT5Whs3iDASwjC6znaqOaWglJ.J2DqKl6LVGKe9ZSJIcz6/o9Z2', 3),
(54, 'rigoerazo@gmail.com', '$2b$08$emRf5.Rr/6kVzcUasOiTsu7mJ48Nt/5i5lOmMYOBQNLjxBcFKkJ9y', 3),
(56, 'raul@antonio.cl', '$2b$08$X2.vUBq9QUbhdGDYxa4pkuqPVv2Q.nUQ2oPz1kNFGHu67GltwO2za', 3),
(57, 'cliente1@cliente.cl', '$2b$08$DwqG/Igx6OOuBpyuA9jt4OWrDCkPnZAHQsysAw6heP4YzYYpvHSza', 3),
(58, 'cliente2@cliente.cl', '$2b$08$pvZrNaUyPxapHQIj9lVfWOIwVi/NKCPACWmqv0p2d8blZf7BfS0Xm', 3),
(60, 'cliente3@cliente.cl', '$2b$08$WCphbo3/PvgJ9EedbheUVubHbgmF8TriC49BnXnbbbm/R3/T8lPPe', 3),
(62, 'cliente4@cliente.cl', '$2b$08$wLd/796cHoiE0I.kmaOC4e5S4iQ0J2IHzdp2GtA2TFTHCQBuLlln2', 3),
(69, 'new@new.cl', '$2b$08$2IPV6NMLDWWCu0Tq3.68aeyCwSzYMXchGEKuntnlR3XraxO3l/0vy', 3),
(70, 'cji@uiybh.cl', '$2b$08$IdXk7A0IfYu52splxIESgOYjmXvzhHavVoT3rtPB6Gl6d0hOW6pa2', 3),
(71, 'asdsad@dsf.cl', '$2b$08$WSYeQPXkw7nHCGsli9mD3uKf9Oa42n7oUZPi6QvdweV4ZEcqrb1bS', 3),
(72, 'aqdswiusgh@sadiubh.cl', '$2b$08$mKlBShpdJpl4EjnO46YLiO14ZJp7D8F.9L9gb1fZPUfxPYNCvXq06', 3),
(73, 'javi@erazo.cl', '$2b$08$kXjIBzjAU6TN1T7Frn5tQ.wgbdC7CayjguPDPgPCxA/WvdKj0nNb6', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`idCategoria`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idCliente`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `envio`
--
ALTER TABLE `envio`
  ADD PRIMARY KEY (`idEnvio`);

--
-- Indices de la tabla `metodopago`
--
ALTER TABLE `metodopago`
  ADD PRIMARY KEY (`idMetodoPago`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`idPedido`),
  ADD KEY `idMetodoPago` (`idMetodoPago`),
  ADD KEY `idEnvio` (`idEnvio`),
  ADD KEY `pedido_ibfk_1` (`idCliente`);

--
-- Indices de la tabla `pedidodetalle`
--
ALTER TABLE `pedidodetalle`
  ADD PRIMARY KEY (`idPedidoDetalle`),
  ADD KEY `idPedido` (`idPedido`),
  ADD KEY `idProducto` (`idProducto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`idProducto`),
  ADD KEY `idCategoria` (`idCategoria`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`idStock`),
  ADD KEY `idProducto` (`idProducto`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `idRol` (`idRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `idCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idCliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `envio`
--
ALTER TABLE `envio`
  MODIFY `idEnvio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `metodopago`
--
ALTER TABLE `metodopago`
  MODIFY `idMetodoPago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `idPedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `pedidodetalle`
--
ALTER TABLE `pedidodetalle`
  MODIFY `idPedidoDetalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `idProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `stock`
--
ALTER TABLE `stock`
  MODIFY `idStock` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`idMetodoPago`) REFERENCES `metodopago` (`idMetodoPago`),
  ADD CONSTRAINT `pedido_ibfk_3` FOREIGN KEY (`idEnvio`) REFERENCES `envio` (`idEnvio`);

--
-- Filtros para la tabla `pedidodetalle`
--
ALTER TABLE `pedidodetalle`
  ADD CONSTRAINT `pedidodetalle_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`),
  ADD CONSTRAINT `pedidodetalle_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`idCategoria`) REFERENCES `categoria` (`idCategoria`);

--
-- Filtros para la tabla `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
