<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PasienRequest extends FormRequest
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
        'nama' => 'required|string|max:255',
        'nik' => 'required|string|size:16|unique:pasiens,nik',
        'telepon' => 'required|string',
        'jenis_kunjungan' => 'required|string',
        'pegawai_id' => 'required|exists:pegawais,id',
    ];
    }
}
