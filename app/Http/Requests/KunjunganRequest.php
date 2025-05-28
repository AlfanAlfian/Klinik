<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KunjunganRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tindakan' => 'required|string',
            'tarif_tindakan' => 'required|numeric',
            'product_ids' => 'required|array|min:1', 
            'product_ids.*' => 'exists:products,id',
            'total_tagihan' => 'numeric'
        ];
    }

    public function messages()
    {
        return [
            'product_ids.required' => 'Silahkan pilih minimal 1 product',
            'product_ids.min' => 'Silahkan pilih minimal 1 product',
        ];
    }
}
