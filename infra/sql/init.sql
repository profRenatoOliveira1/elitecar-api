-- Criação da tabela 'clientes'
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    telefone VARCHAR(16)
);

-- Criação da tabela 'carros'
CREATE TABLE IF NOT EXISTS carros (
    id_carro SERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    ano INT,
    cor VARCHAR(20)
);

-- Criação da tabela 'pedidos_venda'
CREATE TABLE IF NOT EXISTS pedidos_venda (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_carro INT NOT NULL,
    data_pedido DATE NOT NULL,
    valor_pedido DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_carro) REFERENCES carros(id_carro)
);

-- Inserts para a tabela 'cliente'
INSERT INTO clientes (nome, cpf, telefone) VALUES
('JOÃO SILVA', '12345678901', '11912345678'),
('MARIA OLIVEIRA', '23456789012', '21912345678'),
('CARLOS SOUZA', '34567890123', '31912345678'),
('ANA SANTOS', '45678901234', '41912345678'),
('PAULO LIMA', '56789012345', '51912345678');

-- Inserts para a tabela 'carro'
INSERT INTO carros (marca, modelo, ano, cor) VALUES
('TOYOTA', 'COROLLA', 2020, 'PRETO'),
('HONDA', 'CIVIC', 2019, 'BRANCO'),
('FORD', 'FIESTA', 2018, 'VERMELHO'),
('CHEVROLET', 'ONIX', 2021, 'AZUL'),
('VOLKSWAGEN', 'GOL', 2022, 'CINZA');

-- Inserts para a tabela 'pedido_venda'
INSERT INTO pedidos_venda (id_cliente, id_carro, data_pedido, valor_pedido) VALUES
(1, 5, '2023-09-10', 75000.00),
(2, 4, '2023-08-15', 68000.00),
(3, 3, '2023-07-20', 45000.00),
(4, 2, '2023-06-25', 78000.00),
(5, 1, '2023-05-30', 53000.00);