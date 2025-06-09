class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id;
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.status = ticket.status;
    this.products = ticket.products.map(item => ({
      id: item.product._id || item.product,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));
    this.productCount = ticket.products.length;
    this.itemCount = ticket.products.reduce((total, item) => total + item.quantity, 0);
  }

  static fromTicket(ticket) {
    return new TicketDTO(ticket);
  }

  static fromTickets(tickets) {
    return tickets.map(ticket => new TicketDTO(ticket));
  }
}

class TicketSummaryDTO {
  constructor(ticket) {
    this.id = ticket._id;
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.status = ticket.status;
    this.productCount = ticket.products.length;
    this.itemCount = ticket.products.reduce((total, item) => total + item.quantity, 0);
  }

  static fromTicket(ticket) {
    return new TicketSummaryDTO(ticket);
  }

  static fromTickets(tickets) {
    return tickets.map(ticket => new TicketSummaryDTO(ticket));
  }
}

module.exports = {
  TicketDTO,
  TicketSummaryDTO
}; 