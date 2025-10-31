const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');

// POST /promo/validate - Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    if (!code || !orderValue) {
      return res.status(400).json({
        success: false,
        message: 'Promo code and order value are required',
      });
    }

    // Find promo code
    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code',
      });
    }

    // Check expiry
    if (new Date() > new Date(promoCode.expiryDate)) {
      return res.status(400).json({
        success: false,
        message: 'Promo code has expired',
      });
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Promo code usage limit reached',
      });
    }

    // Check minimum order value
    if (orderValue < promoCode.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${promoCode.minOrderValue} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = (orderValue * promoCode.discountValue) / 100;
      if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
        discount = promoCode.maxDiscount;
      }
    } else {
      discount = promoCode.discountValue;
    }

    const finalPrice = orderValue - discount;

    res.json({
      success: true,
      message: 'Promo code applied successfully',
      data: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        discount: Math.round(discount),
        finalPrice: Math.round(finalPrice),
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating promo code',
      error: error.message,
    });
  }
});

module.exports = router;
