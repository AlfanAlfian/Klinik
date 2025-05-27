<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::latest()->get()->map(fn($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'stock' => $product->stock,
            'category' => $product->category,
            'featured_image' => $product->featured_image_url,
            'featured_image_original_name' => $product->featured_image_original_name,
            'created_at' => $product->created_at->format('d M Y'),
        ]);

        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('products/product-form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        try {

            $featuredImage = null;
            $featuredImageOriginalName = null;

            if ($request->file('featured_image')) {
                $featuredImage = $request->file('featured_image');
                $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                $featuredImage = $featuredImage->store('products', 'public');
            }

            $product = Product::create([
                'name' => $request->name,
                'price' => $request->price,
                'category' => $request->category,
                'featured_image' => $featuredImage,
                'featured_image_original_name' => $featuredImageOriginalName,
            ]);

            if ($product) {
                return redirect()->route('products.index')->with('success', 'Product created successfully');
            }

            return redirect()->back()->with('error', 'Unable to create product');
        } catch (Exception $e) {
            Log::error('product creation failed:' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('products/product-form', [
            'product' => $product,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {

        try {
            if ($product) {
                $product->name = $request->name;
                $product->price = $request->price;
                $product->category = $request->category;

                $featuredImage = null;
                $featuredImageOriginalName = null;

                if ($request->file('featured_image')) {
                    $featuredImage = $request->file('featured_image');
                    $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                    $featuredImage = $featuredImage->store('products', 'public');

                    $product->featured_image = $featuredImage;
                    $product->featured_image_original_name = $featuredImageOriginalName;
                }

                $product->save();

                return redirect()->route('products.index')->with('success', 'Product updated successfully');
            }

            return redirect()->back()->with('error', 'Umanle to update Product');
        } catch (Exception $e) {
            Log::error('Product update failed: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {

            if ($product) {
                $product->delete();

                return redirect()->back()->with('success', 'Product Deleted Successfully');
            }

            return redirect()->back()->with('error', 'Unable to delete Product');
        } catch (Exception $e) {
            Log::error('Product deletion failed: ' . $e->getMessage());
        }
    }


    public function stock(Product $product)
    {
        return Inertia::render('products/stock', [
            'product' => $product,
        ]);
    }

    public function addStock(Request $request, Product $product)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $product->increment('stock', $request->quantity);

        $product->stockLogs()->create([
            'type' => 'in',
            'quantity' => $request->quantity,
        ]);
        return redirect()->route('products.index')->with('success', 'Stok updated successfully');
    }

    public function removeStock(Request $request, Product $product)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        if ($product->stock < $request->quantity) {
            return redirect()->back()->with('error', 'Stok tidak mencukupi');
        }

        $product->decrement('stock', $request->quantity);

        $product->stockLogs()->create([
            'type' => 'out',
            'quantity' => $request->quantity,
        ]);

        return redirect()->route('products.index')->with('success', 'Stok updated successfully');
    }
}
