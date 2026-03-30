import ExemploModel from '../models/ExemploModel.js';

/**
 * @typedef {object} ReqBodyExemplo
 * @property {string} nome
 * @property {boolean} estado.required
 * @property {number} preco.required
 */

/**
 * POST /api/exemplos
 * @tags Exemplos
 * @summary Cria um novo registro de exemplo
 * @description EndPoint responsável por cadastrar um novo exemplo no sistema web
 * @param {ReqBodyExemplo} request.body.required
 *
 * @return 201 - Exemplo criado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 500 - Erro interno do servidor
 */

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, estado, preco } = req.body;

        if (!nome){
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
        if (preco === undefined || preco === null) {
            return res.status(400).json({ error: 'O campo "preco" é obrigatório!' });
        }

        const exemplo = new ExemploModel({ nome, estado, preco: parseFloat(preco) });
        const data = await exemplo.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

/**
 * GET /api/exemplos
 * @tags Exemplos
 * @summary Busca todos os registros de exemplos
 * @description EndPoint responsável por buscar exemplos cadastrados no sistema web.
 * Permite filtrar os resultados utilizando parâmetros de consulta (query paramns).
 *
 * @param {string} nome.query
 * @param {boolean} estado.query
 * @param {number} preco.query
 *
 * @return 200 - Exemplo encontrado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 500 - Erro interno do servidor
 */

export const buscarTodos = async (req, res) => {
    try {
        const registros = await ExemploModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum registro encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

/**
 * GET /api/exemplos/{id}
 * @tags Exemplos
 * @summary Busca um registro de exemplo por ID
 * @description EndPoint responsável por buscar um exemplo específico cadastrado no sistema web a partir do ID.
 * @param {integer} id.path.required
 *
 * @return 200 - Exemplo encontrado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 404 - ID não encontrado
 * @return 500 - Erro interno do servidor
 */

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const exemplo = await ExemploModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: exemplo });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

/**
 * PUT /api/exemplos/{id}
 * @tags Exemplos
 * @summary Atualiza um registro de exemplo
 * @description EndPoint responsável por atualizar um exemplo no sistema web
 *
 * @param {integer} id.path.required
 * @param {ReqBodyExemplo} request.body.required
 *
 * @return 201 - Exemplo atualizado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 404 - Exemplo não foi encontrado
 * @return 500 - Erro interno do servidor
 */

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const exemplo = await ExemploModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            exemplo.nome = req.body.nome;
        }
        if (req.body.estado !== undefined) {
            exemplo.estado = req.body.estado;
        }
        if (req.body.preco !== undefined) {
            exemplo.preco = parseFloat(req.body.preco);
        }

        const data = await exemplo.atualizar();

        return res.status(200).json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

/**
 * DELETE /api/exemplos/{id}
 * @tags Exemplos
 * @summary Deleta um registro de exemplo por ID
 * @description EndPoint responsável por deletar um exemplo específico cadastrado no sistema web a partir do ID.
 * @param {integer} id.path.required
 *
 * @return 200 - Exemplo deletado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 404 - ID não encontrado
 * @return 500 - Erro interno do servidor
 */

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const exemplo = await ExemploModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await exemplo.deletar();

        return res.status(200).json({ message: `O registro "${exemplo.nome}" foi deletado com sucesso!`, deletado: exemplo });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
