<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WilayahRequest extends FormRequest
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
            'nama_wilayah' => 'required|string|max:255',
            'tipe' => 'required|in:provinsi,kabupaten',
            'wilayah_induk_id' => 'nullable|exists:wilayahs,id',
        ];
    }
}
