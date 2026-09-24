const instrumentService = require('../services/instrument.service');

async function create(req, res) {
  try {
    const instrument = await instrumentService.createInstrument(req.user, req.body);
    return res.status(201).json({
      success: true,
      message: 'Instrument registered successfully',
      data: {
        instrument
      }
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Failed to create instrument'
    });
  }
}

async function getAll(req, res) {
  try {
    const instruments = await instrumentService.getInstruments(req.user);
    return res.status(200).json({
      success: true,
      count: instruments.length,
      data: {
        instruments
      }
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Failed to fetch instruments'
    });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const instrument = await instrumentService.getInstrumentById(req.user, id);
    return res.status(200).json({
      success: true,
      data: {
        instrument
      }
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Failed to fetch instrument details'
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const updated = await instrumentService.updateInstrument(req.user, id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Instrument updated successfully',
      data: {
        instrument: updated
      }
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Failed to update instrument'
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const result = await instrumentService.deleteInstrument(req.user, id);
    return res.status(200).json({
      success: true,
      message: 'Instrument deleted successfully',
      data: result
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Failed to delete instrument'
    });
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};
