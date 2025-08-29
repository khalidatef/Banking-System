import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber?: string;
}

@Component({
  selector: 'app-fund-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fund-transfer.component.html',
  styleUrl: './fund-transfer.component.css'
})
export class FundTransferComponent implements OnInit {
  transferForm!: FormGroup;
  isProcessing = false;
  transferFee = 0;

  userAccounts: Account[] = [
    {
      id: '1',
      name: 'Savings Account',
      type: 'Savings',
      balance: 5000.00
    },
    {
      id: '2', 
      name: 'Checking Account',
      type: 'Checking',
      balance: 2500.00
    }
  ];

  destinationAccounts: Account[] = [
    {
      id: '3',
      name: 'Ahmed Mohamed',
      type: 'External',
      balance: 0,
      accountNumber: '****1234'
    },
    {
      id: '4',
      name: 'Sara Ahmed',
      type: 'External', 
      balance: 0,
      accountNumber: '****5678'
    },
    {
      id: '5',
      name: 'Mohamed Ali',
      type: 'External',
      balance: 0,
      accountNumber: '****9012'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.transferForm = this.fb.group({
      fromAccount: ['', [Validators.required]],
      toAccount: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.maxLength(100)]]
    });

    // Watch for amount changes to calculate fees
    this.transferForm.get('amount')?.valueChanges.subscribe(amount => {
      this.calculateTransferFee(amount);
    });
  }

  onSubmit(): void {
    if (this.transferForm.valid && !this.isProcessing) {
      this.isProcessing = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isProcessing = false;
        alert('Transfer completed successfully!');
        this.resetForm();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.transferForm.reset();
    this.transferFee = 0;
  }

  hasError(controlName: string): boolean {
    const control = this.transferForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(controlName: string): string {
    const control = this.transferForm.get(controlName);
    if (control && control.errors && (control.dirty || control.touched)) {
      if (control.errors['required']) {
        return `${this.getFieldName(controlName)} is required`;
      }
      if (control.errors['min']) {
        return 'Amount must be greater than $0.01';
      }
      if (control.errors['maxlength']) {
        return 'Description cannot exceed 100 characters';
      }
    }
    return '';
  }

  private getFieldName(controlName: string): string {
    const fieldNames: { [key: string]: string } = {
      'fromAccount': 'Source account',
      'toAccount': 'Destination account', 
      'amount': 'Amount',
      'description': 'Description'
    };
    return fieldNames[controlName] || controlName;
  }

  getAvailableBalance(): number {
    const fromAccountId = this.transferForm.get('fromAccount')?.value;
    const account = this.userAccounts.find(acc => acc.id === fromAccountId);
    return account ? account.balance : 0;
  }

  private calculateTransferFee(amount: number): void {
    // Simple fee calculation - $2 for transfers over $1000
    this.transferFee = amount > 1000 ? 2.00 : 0;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.transferForm.controls).forEach(key => {
      const control = this.transferForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
