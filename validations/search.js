import { query } from 'express-validator';

export const searchValidation = [
    query('q')
        .notEmpty().withMessage('Поисковый запрос не может быть пустым')
        .isString().withMessage('Запрос должен быть строкой')
        .isLength({ max: 50 }).withMessage('Запрос слишком длинный (макс. 50 символов)')
        .trim(),
    query('type')
        .optional()
        .isIn(['post', 'user']).withMessage('Допустимые типы поиска: post или user'),

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Номер страницы должен быть числом больше 0')
        .toInt(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 }).withMessage('Лимит должен быть от 1 до 50')
        .toInt()
];